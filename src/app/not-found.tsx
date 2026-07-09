import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-mesh">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-slate-400 mb-8">Page not found</p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
