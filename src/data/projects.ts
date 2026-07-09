export interface Project {
  slug: string;
  featured: boolean;
  tags: string[];
  images: string[];
  links: {
    github?: string;
    live?: string;
  };
  title: { en: string; fa: string };
  description: { en: string; fa: string };
  longDescription: { en: string; fa: string };
}

export const projects: Project[] = [];

// When adding projects, also create src/app/projects/[slug]/page.tsx
// See src/components/projects/ProjectDetail.tsx

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
