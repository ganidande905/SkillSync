import { apiGet } from "../../../api/client";
import type { DashboardData } from "./dashboardModel";

interface UserSkill {
  id: number;
  user_id: number;
  skill_name: string;
  proficiency_level: string;
}

interface LeaderboardUser {
  id: number;
  name: string;
  email: string;
  score: number;
}

interface TeamInvite {
  id: number;
  user_id: number;
  role: string;
  status: string;
}

interface Project {
  id: number;
  user_id: number;
  project_name: string;
  description: string;
  repository_url: string;
  requirements: string;
  last_commit_message: string | null;
  last_commit_sha: string | null;
  last_commit_url: string | null;
  skill_requirements: unknown[];
}

interface UserInterest {
  id: number;
  user_id: number;
  interest_name: string;
}

interface PastProject {
  id: number;
  user_id: number;
  project_title: string;
  description: string;
  technologies_used: string;
}

async function fetchUserSkills(userId: number): Promise<UserSkill[]> {
    return apiGet<UserSkill[]>(`/onboarding/${userId}/skills`);
  }
  
  async function fetchLeaderboard(): Promise<LeaderboardUser[]> {
    return apiGet<LeaderboardUser[]>(`/leaderboard/`);
  }
  
  async function fetchTeamInvites(userId: number): Promise<TeamInvite[]> {
    return apiGet<TeamInvite[]>(`/teams/team-invites/${userId}`);
  }
  
  async function fetchUserProjects(userId: number): Promise<Project[]> {
    return apiGet<Project[]>(`/projects/${userId}/projects`);
  }
  
  async function fetchUserInterests(userId: number): Promise<UserInterest[]> {
    return apiGet<UserInterest[]>(`/onboarding/${userId}/interest`);
  }
  
  async function fetchPastProjects(userId: number): Promise<PastProject[]> {
    return apiGet<PastProject[]>(`/onboarding/${userId}/past-projects`);
  }
  
  export async function getDashboardSummary(
    userId: number,
    userNameFallback: string
  ): Promise<DashboardData> {
    const [
      skills,
      leaderboard,
      invites,
      projects,
      interests,
      pastProjects,
    ] = await Promise.all([
      fetchUserSkills(userId),
      fetchLeaderboard(),
      fetchTeamInvites(userId),
      fetchUserProjects(userId),
      fetchUserInterests(userId),
      fetchPastProjects(userId),
    ]);
  
    const skillNames = skills.map((s) => s.skill_name);
  
    const activeTeams = invites.filter(
      (inv) => inv.status.toLowerCase() === "accepted"
    ).length;
  
    const pendingInvites = invites.filter(
      (inv) => inv.status.toLowerCase() === "pending"
    ).length;
  
    const projectsCount = projects.length;
    const interestsCount = interests.length;
    const pastProjectsCount = pastProjects.length;
  
    let skillScore = 0;
    let globalRank = 0;
  
    if (leaderboard.length > 0) {
      const sorted = [...leaderboard].sort((a, b) => b.score - a.score);
      const userIndex = sorted.findIndex((u) => u.id === userId);
  
      if (userIndex !== -1) {
        globalRank = userIndex + 1;
        skillScore = sorted[userIndex].score;
      } else {
        skillScore = skillNames.length * 10;
        globalRank = sorted.length + 1;
      }
    }
  
    const latestCommitMessage =
      projects.find(
        (p) =>
          p.last_commit_message &&
          p.last_commit_message.trim().length > 0
      )?.last_commit_message ?? null;
  
    return {
      userName: userNameFallback,
      activeTeams,
      skillScore,
      globalRank,
      skills: skillNames,
      latestCommitMessage,
      pendingInvites,
      projectsCount,
      pastProjectsCount,
      interestsCount,
    };
  }