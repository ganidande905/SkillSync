export interface DashboardData {
  userName: string;
  activeTeams: number;
  skillScore: number;
  globalRank: number;

  skills: string[];

  latestCommitMessage: string | null;
  pendingInvites: number;
  projectsCount: number;
  pastProjectsCount: number;
  interestsCount: number;
}