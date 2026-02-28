import type { Project } from '@/lib/estimator/projectModel';

const KEY = 'estimator_projects_v1';

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(KEY, JSON.stringify(projects));
}

export function upsertProject(project: Project) {
  const projects = loadProjects();
  const idx = projects.findIndex((p) => p.meta.id === project.meta.id);
  if (idx === -1) projects.unshift(project);
  else projects[idx] = project;
  saveProjects(projects);
}

export function getProject(id: string): Project | null {
  const projects = loadProjects();
  return projects.find((p) => p.meta.id === id) ?? null;
}