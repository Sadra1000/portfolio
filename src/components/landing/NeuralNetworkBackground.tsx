"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  dispX: number;
  dispY: number;
  pulse: number;
  id: number;
}

interface Edge {
  from: number;
  to: number;
}

interface Signal {
  edgeIndex: number;
  progress: number;
  speed: number;
  intensity: number;
  forward: boolean;
}

interface MouseState {
  x: number;
  y: number;
  active: boolean;
}

interface Curve {
  x0: number;
  y0: number;
  cpx: number;
  cpy: number;
  x1: number;
  y1: number;
}

interface PendingSignal {
  executeAt: number;
  edgeIndex: number;
  forward: boolean;
  intensity: number;
  speed: number;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function quadPoint(c: Curve, t: number) {
  const u = 1 - t;
  return {
    x: u * u * c.x0 + 2 * u * t * c.cpx + t * t * c.x1,
    y: u * u * c.y0 + 2 * u * t * c.cpy + t * t * c.y1,
  };
}

function distSq(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

function createSeededRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function randomSignalSpeed(rand: () => number) {
  return 0.14 + rand() * 0.26;
}

export function NeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const layoutSeed =
      (Date.now() ^ Math.floor(Math.random() * 1_000_000)) >>> 0;
    const rand = createSeededRandom(layoutSeed);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let curves: Curve[] = [];
    let signals: Signal[] = [];
    let pendingSignals: PendingSignal[] = [];
    let animationId = 0;
    let lastTime = 0;
    let frameCount = 0;
    let ambientPhase = 0;

    const mouse: MouseState = { x: -9999, y: -9999, active: false };

    const MAX_SIGNALS = 90;
    const MOUSE_RADIUS = 200;
    const REPULSE_RADIUS = 70;
    const MAX_DISPLACEMENT = 22;
    const ATTRACT_STRENGTH = 18;

    const getNodeCount = () => (width < 768 ? 40 : width < 1200 ? 58 : 76);
    const getConnectDist = () => (width < 768 ? 125 : 160);
    const getConnectDistSq = () => getConnectDist() ** 2;

    const renderPos = (node: Node) => ({
      x: node.x + node.dispX,
      y: node.y + node.dispY,
    });

    const capDisplacement = (node: Node) => {
      const mag = Math.sqrt(node.dispX * node.dispX + node.dispY * node.dispY);
      if (mag > MAX_DISPLACEMENT) {
        const scale = MAX_DISPLACEMENT / mag;
        node.dispX *= scale;
        node.dispY *= scale;
      }
    };

    const initNodes = () => {
      const count = getNodeCount();
      const layoutType = Math.floor(rand() * 3);
      nodes = [];

      if (layoutType === 0) {
        for (let id = 0; id < count; id++) {
          nodes.push({
            x: rand() * width,
            y: rand() * height,
            vx: (rand() - 0.5) * 0.22,
            vy: (rand() - 0.5) * 0.22,
            radius: rand() * 1.3 + 1.3,
            dispX: 0,
            dispY: 0,
            pulse: 0,
            id,
          });
        }
      } else if (layoutType === 1) {
        const clusterCount = 3 + Math.floor(rand() * 2);
        const clusters = Array.from({ length: clusterCount }, () => ({
          x: width * (0.15 + rand() * 0.7),
          y: height * (0.15 + rand() * 0.7),
        }));

        for (let id = 0; id < count; id++) {
          const cluster = clusters[id % clusterCount];
          const angle = rand() * Math.PI * 2;
          const spread = 40 + rand() * 120;
          nodes.push({
            x: Math.max(20, Math.min(width - 20, cluster.x + Math.cos(angle) * spread)),
            y: Math.max(20, Math.min(height - 20, cluster.y + Math.sin(angle) * spread)),
            vx: (rand() - 0.5) * 0.2,
            vy: (rand() - 0.5) * 0.2,
            radius: rand() * 1.3 + 1.3,
            dispX: 0,
            dispY: 0,
            pulse: 0,
            id,
          });
        }
      } else {
        const cols = Math.ceil(Math.sqrt(count * (width / height)));
        const rows = Math.ceil(count / cols);
        const cellW = width / cols;
        const cellH = height / rows;

        for (let id = 0; id < count; id++) {
          const col = id % cols;
          const row = Math.floor(id / cols);
          nodes.push({
            x: col * cellW + cellW * 0.5 + (rand() - 0.5) * cellW * 0.55,
            y: row * cellH + cellH * 0.5 + (rand() - 0.5) * cellH * 0.55,
            vx: (rand() - 0.5) * 0.18,
            vy: (rand() - 0.5) * 0.18,
            radius: rand() * 1.3 + 1.3,
            dispX: 0,
            dispY: 0,
            pulse: 0,
            id,
          });
        }
      }

      edges = [];
      curves = [];
      signals = [];
      pendingSignals = [];
    };

    const rebuildEdges = () => {
      const maxDistSq = getConnectDistSq();
      const newEdges: Edge[] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (distSq(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y) < maxDistSq) {
            newEdges.push({ from: i, to: j });
          }
        }
      }
      edges = newEdges;
      curves = new Array(edges.length);
    };

    const buildCurve = (edgeIndex: number): Curve => {
      const edge = edges[edgeIndex];
      const a = renderPos(nodes[edge.from]);
      const b = renderPos(nodes[edge.to]);
      const mx = (a.x + b.x) * 0.5;
      const my = (a.y + b.y) * 0.5;

      let bendX = 0;
      let bendY = 0;

      if (mouse.active) {
        const mdx = mouse.x - mx;
        const mdy = mouse.y - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > REPULSE_RADIUS) {
          const pull = ((mDist - REPULSE_RADIUS) / (MOUSE_RADIUS - REPULSE_RADIUS)) ** 2;
          bendX = (mdx / mDist) * pull * 35;
          bendY = (mdy / mDist) * pull * 35;
        }
      }

      return {
        x0: a.x,
        y0: a.y,
        cpx: mx + bendX,
        cpy: my + bendY,
        x1: b.x,
        y1: b.y,
      };
    };

    const spawnSignalOnEdge = (
      edgeIndex: number,
      forward = true,
      intensity = 1,
      speed?: number
    ) => {
      if (signals.length >= MAX_SIGNALS || edgeIndex < 0 || edgeIndex >= edges.length) return;
      signals.push({
        edgeIndex,
        progress: forward ? 0 : 1,
        speed: speed ?? randomSignalSpeed(rand),
        intensity,
        forward,
      });
    };

    const queueSignal = (
      edgeIndex: number,
      forward: boolean,
      intensity: number,
      speed: number,
      delayMs = 0
    ) => {
      pendingSignals.push({
        executeAt: performance.now() + delayMs,
        edgeIndex,
        forward,
        intensity,
        speed,
      });
    };

    const burstFromNode = (nodeIndex: number, intensity = 1.2) => {
      const connected: number[] = [];
      for (let i = 0; i < edges.length; i++) {
        if (edges[i].from === nodeIndex || edges[i].to === nodeIndex) {
          connected.push(i);
        }
      }

      if (connected.length === 0) {
        nodes[nodeIndex].pulse = 1;
        return;
      }

      for (const edgeIndex of connected) {
        const edge = edges[edgeIndex];
        const forward = edge.from === nodeIndex;
        const speed = randomSignalSpeed(rand);
        spawnSignalOnEdge(edgeIndex, forward, intensity, speed);
        queueSignal(
          edgeIndex,
          !forward,
          intensity * 0.55,
          randomSignalSpeed(rand),
          90 + rand() * 100
        );
      }

      nodes[nodeIndex].pulse = 1;
    };

    const findNearestNode = (x: number, y: number) => {
      let closest = 0;
      let minDistSq = Infinity;

      for (let i = 0; i < nodes.length; i++) {
        const p = renderPos(nodes[i]);
        const d = distSq(p.x, p.y, x, y);
        if (d < minDistSq) {
          minDistSq = d;
          closest = i;
        }
      }
      return closest;
    };

    const ambientSpawn = () => {
      if (edges.length === 0 || signals.length >= MAX_SIGNALS * 0.65) return;
      if (rand() > 0.5) return;
      const edgeIndex = Math.floor(rand() * edges.length);
      spawnSignalOnEdge(edgeIndex, rand() > 0.5, 0.45, randomSignalSpeed(rand));
    };

    const resize = () => {
      const prevW = width;
      const prevH = height;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (prevW > 0 && prevH > 0 && nodes.length > 0) {
        for (const node of nodes) {
          node.x = (node.x / prevW) * width;
          node.y = (node.y / prevH) * height;
        }
        rebuildEdges();
      } else {
        initNodes();
        rebuildEdges();
      }
    };

    const updateMouse = (clientX: number, clientY: number, active: boolean) => {
      const rect = canvas.getBoundingClientRect();
      const newX = clientX - rect.left;
      const newY = clientY - rect.top;

      mouse.active =
        active && newX >= 0 && newX <= width && newY >= 0 && newY <= height;

      if (mouse.active) {
        mouse.x = newX;
        mouse.y = newY;
      }
    };

    const applyMouseDisplacement = (node: Node) => {
      if (!mouse.active) {
        node.dispX = lerp(node.dispX, 0, 0.08);
        node.dispY = lerp(node.dispY, 0, 0.08);
        return;
      }

      const px = node.x + node.dispX;
      const py = node.y + node.dispY;
      const dx = mouse.x - px;
      const dy = mouse.y - py;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetDispX = 0;
      let targetDispY = 0;

      if (dist > 0 && dist < MOUSE_RADIUS) {
        if (dist < REPULSE_RADIUS) {
          const repulse = (1 - dist / REPULSE_RADIUS) ** 2;
          targetDispX = -(dx / dist) * repulse * 14;
          targetDispY = -(dy / dist) * repulse * 14;
        } else {
          const t = (dist - REPULSE_RADIUS) / (MOUSE_RADIUS - REPULSE_RADIUS);
          const attract = (1 - t) ** 2;
          targetDispX = (dx / dist) * attract * ATTRACT_STRENGTH;
          targetDispY = (dy / dist) * attract * ATTRACT_STRENGTH;
        }
      }

      node.dispX = lerp(node.dispX, targetDispX, 0.07);
      node.dispY = lerp(node.dispY, targetDispY, 0.07);
      capDisplacement(node);
    };

    const draw = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 16.67, 2) : 1;
      lastTime = time;
      ambientPhase += 0.012 * dt;

      for (let i = pendingSignals.length - 1; i >= 0; i--) {
        if (time >= pendingSignals[i].executeAt) {
          const p = pendingSignals[i];
          spawnSignalOnEdge(p.edgeIndex, p.forward, p.intensity, p.speed);
          pendingSignals.splice(i, 1);
        }
      }

      ctx.clearRect(0, 0, width, height);

      for (const node of nodes) {
        node.x += node.vx * dt;
        node.y += node.vy * dt;

        if (node.x < 24 || node.x > width - 24) node.vx *= -1;
        if (node.y < 24 || node.y > height - 24) node.vy *= -1;

        node.x = Math.max(16, Math.min(width - 16, node.x));
        node.y = Math.max(16, Math.min(height - 16, node.y));

        applyMouseDisplacement(node);

        node.vx *= 0.994;
        node.vy *= 0.994;

        if (node.pulse > 0) {
          node.pulse = Math.max(0, node.pulse - 0.022 * dt);
        }
      }

      frameCount++;
      if (frameCount % 20 === 0) rebuildEdges();

      for (let i = 0; i < edges.length; i++) {
        curves[i] = buildCurve(i);
      }

      if (frameCount % 40 === 0) ambientSpawn();

      for (let i = 0; i < edges.length; i++) {
        const curve = curves[i];
        const edge = edges[i];
        const a = renderPos(nodes[edge.from]);
        const b = renderPos(nodes[edge.to]);
        const dist = Math.sqrt(distSq(a.x, a.y, b.x, b.y));
        const maxDist = getConnectDist();
        let alpha = (1 - dist / maxDist) * 0.3;

        const midX = (curve.x0 + curve.x1) * 0.5;
        const midY = (curve.y0 + curve.y1) * 0.5;
        const mDist = Math.sqrt(distSq(midX, midY, mouse.x, mouse.y));

        if (mouse.active && mDist < MOUSE_RADIUS && mDist > REPULSE_RADIUS) {
          const t = (mDist - REPULSE_RADIUS) / (MOUSE_RADIUS - REPULSE_RADIUS);
          alpha = Math.min(0.65, alpha + (1 - t) * 0.35);
        }

        ctx.beginPath();
        ctx.moveTo(curve.x0, curve.y0);
        ctx.quadraticCurveTo(curve.cpx, curve.cpy, curve.x1, curve.y1);
        ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        if (alpha > 0.22) {
          ctx.beginPath();
          ctx.moveTo(curve.x0, curve.y0);
          ctx.quadraticCurveTo(curve.cpx, curve.cpy, curve.x1, curve.y1);
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.3})`;
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
      }

      for (let i = signals.length - 1; i >= 0; i--) {
        const signal = signals[i];
        const curve = curves[signal.edgeIndex];
        if (!curve) {
          signals.splice(i, 1);
          continue;
        }

        const step = signal.speed * 0.007 * dt;
        signal.progress += signal.forward ? step : -step;

        if (signal.progress >= 1 || signal.progress <= 0) {
          const edge = edges[signal.edgeIndex];
          if (edge && rand() < 0.2) {
            const arrivedNode = signal.forward ? edge.to : edge.from;
            for (let e = 0; e < edges.length; e++) {
              if (e === signal.edgeIndex) continue;
              const ed = edges[e];
              if (ed.from === arrivedNode || ed.to === arrivedNode) {
                spawnSignalOnEdge(
                  e,
                  ed.from === arrivedNode,
                  signal.intensity * 0.65,
                  randomSignalSpeed(rand)
                );
                break;
              }
            }
          }
          signals.splice(i, 1);
          continue;
        }

        const pos = quadPoint(curve, signal.progress);
        const trailSteps = 4;

        for (let t = 0; t < trailSteps; t++) {
          const trailOffset = t * 0.016;
          const trailT = signal.forward
            ? signal.progress - trailOffset
            : signal.progress + trailOffset;
          if (trailT < 0 || trailT > 1) continue;

          const tp = quadPoint(curve, trailT);
          const fade = (1 - t / trailSteps) * signal.intensity;
          const radius = 3.2 - t * 0.4;

          const glow = ctx.createRadialGradient(tp.x, tp.y, 0, tp.x, tp.y, radius * 2.5);
          glow.addColorStop(0, `rgba(34, 211, 238, ${fade * 0.85})`);
          glow.addColorStop(0.5, `rgba(59, 130, 246, ${fade * 0.35})`);
          glow.addColorStop(1, "rgba(16, 185, 129, 0)");

          ctx.beginPath();
          ctx.arc(tp.x, tp.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        const headGlow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${signal.intensity * 0.65})`);
        headGlow.addColorStop(0.35, `rgba(34, 211, 238, ${signal.intensity * 0.5})`);
        headGlow.addColorStop(1, "rgba(16, 185, 129, 0)");
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();
      }

      for (const node of nodes) {
        const p = renderPos(node);
        let nodeAlpha = 0.52 + Math.sin(ambientPhase + node.id * 0.5) * 0.07;
        let nodeRadius = node.radius;

        if (mouse.active) {
          const d = Math.sqrt(distSq(p.x, p.y, mouse.x, mouse.y));
          if (d < MOUSE_RADIUS && d > REPULSE_RADIUS) {
            const t = (d - REPULSE_RADIUS) / (MOUSE_RADIUS - REPULSE_RADIUS);
            const boost = (1 - t) ** 1.5;
            nodeAlpha = 0.52 + boost * 0.38;
            nodeRadius += boost * 1.8;
          }
        }

        if (node.pulse > 0) {
          nodeRadius += node.pulse * 5;
          nodeAlpha = Math.min(1, nodeAlpha + node.pulse * 0.45);

          const ripple = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 28 + node.pulse * 35);
          ripple.addColorStop(0, `rgba(34, 211, 238, ${node.pulse * 0.22})`);
          ripple.addColorStop(0.5, `rgba(59, 130, 246, ${node.pulse * 0.08})`);
          ripple.addColorStop(1, "rgba(16, 185, 129, 0)");
          ctx.beginPath();
          ctx.arc(p.x, p.y, 28 + node.pulse * 35, 0, Math.PI * 2);
          ctx.fillStyle = ripple;
          ctx.fill();
        }

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, nodeRadius * 4.5);
        glow.addColorStop(0, `rgba(34, 211, 238, ${nodeAlpha})`);
        glow.addColorStop(0.35, `rgba(59, 130, 246, ${nodeAlpha * 0.4})`);
        glow.addColorStop(1, "rgba(16, 185, 129, 0)");

        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeRadius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${nodeAlpha * 0.55})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };

    const onMouseMove = (e: MouseEvent) => updateMouse(e.clientX, e.clientY, true);

    const onMouseLeave = () => {
      mouse.active = false;
    };

    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > width || y < 0 || y > height) return;

      burstFromNode(findNearestNode(x, y), 1.3);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      updateMouse(touch.clientX, touch.clientY, true);

      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      burstFromNode(findNearestNode(x, y), 1.2);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      updateMouse(e.touches[0].clientX, e.touches[0].clientY, true);
    };

    resize();
    animationId = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("click", onClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    canvas.addEventListener("touchend", onMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full touch-none"
      aria-hidden="true"
    />
  );
}
