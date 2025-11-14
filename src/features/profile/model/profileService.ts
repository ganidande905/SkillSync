import { apiGet } from "../../../api/client";
import type { ProfileData } from "./profileModel";


interface Skill {
  id: number;
  user_id: number;
  skill_name: string;
  proficiency_level: string;
}

interface Interest {
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

interface TeamInvite {
  id: number;
  user_id: number;
  role: string;
  status: string;
}

interface ActivityItem {
  text: string;
  time: string;
  color: string;
}

/* === SMALL FETCH HELPERS === */

async function fetchSkills(userId: number): Promise<Skill[]> {
  return apiGet<Skill[]>(`/onboarding/${userId}/skills`);
}

async function fetchInterests(userId: number): Promise<Interest[]> {
  return apiGet<Interest[]>(`/onboarding/${userId}/interest`);
}

async function fetchPastProjects(userId: number): Promise<PastProject[]> {
  return apiGet<PastProject[]>(`/onboarding/${userId}/past-projects`);
}

async function fetchProjects(userId: number): Promise<Project[]> {
  return apiGet<Project[]>(`/projects/${userId}/projects`);
}

async function fetchInvites(userId: number): Promise<TeamInvite[]> {
  return apiGet<TeamInvite[]>(`/teams/team-invites/${userId}`);
}

export async function getProfileSummary(
  userId: number,
  userName: string,
  userEmail: string
): Promise<ProfileData> {
  const [skills, interests, pastProjects, projects, invites] =
    await Promise.all([
      fetchSkills(userId),
      fetchInterests(userId),
      fetchPastProjects(userId),
      fetchProjects(userId),
      fetchInvites(userId),
    ]);

  const teamsAccepted = invites.filter(
    (i) => i.status.toLowerCase() === "accepted"
  ).length;

  const teamsPending = invites.filter(
    (i) => i.status.toLowerCase() === "pending"
  ).length;

  const recentActivity: ActivityItem[] = [];

  if (projects.length > 0) {
    const latest = projects.find((p) => p.last_commit_message);

    if (latest) {
      recentActivity.push({
        text: `Pushed code to ${latest.project_name}`,
        time: "Recently",
        color: "#6366f1",
      });
    }
  }

  if (teamsPending > 0) {
    recentActivity.push({
      text: "You have pending team invites",
      time: "Today",
      color: "#facc15",
    });
  }

  if (skills.length > 0) {
    recentActivity.push({
      text: "Updated your skills",
      time: "This week",
      color: "#34d399",
    });
  }

  return {
    id: userId,
    name: userName,
    email: userEmail,

    skills: skills.map((s) => s.skill_name),
    interests: interests.map((i) => i.interest_name),
    pastProjects,

    projectsCount: projects.length,
    teamsAccepted,
    teamsPending,

    recentActivity,
  };
}