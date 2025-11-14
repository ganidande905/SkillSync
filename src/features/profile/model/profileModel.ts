export interface PastProject {
  id: number;
  project_title: string;
  description: string;
  technologies_used: string;
}

export interface ProfileData {
  id: number;
  name: string;
  email: string;

  skills: string[];
  interests: string[];
  pastProjects: PastProject[];

  projectsCount: number;
  teamsAccepted: number;
  teamsPending: number;

  recentActivity: {
    text: string;
    time: string;
    color: string;
  }[];
}