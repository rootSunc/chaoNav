import type { ProjectId } from '../../../data/siteContent';

const PROJECT_THEME_COLORS: Record<ProjectId, string> = {
  sanakirja: '#4a7c6f',
  arkiwatch: '#286d68',
  qparking: '#f1414d',
  luxestate: '#c9a962',
  ashare: '#3d5a80',
};

export function getProjectThemeColor(projectId: ProjectId): string {
  return PROJECT_THEME_COLORS[projectId];
}
