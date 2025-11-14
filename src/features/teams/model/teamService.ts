import { apiGet, apiPost } from "../../../api/client";
import type {
  Team,
  TeamInvite,
  ProjectCreate,
  ProjectOut,
} from "./teamsModel";

export async function fetchTeamInvites(userId: number): Promise<TeamInvite[]> {
  return apiGet<TeamInvite[]>(`/teams/team-invites/${userId}`);
}


export async function fetchUserProjects(userId: number): Promise<ProjectOut[]> {
  return apiGet<ProjectOut[]>(`/projects/${userId}/projects`);
}


export async function postProjectForUser(
  userId: number,
  payload: ProjectCreate
): Promise<ProjectOut> {
  return apiPost<ProjectOut>(`/projects/${userId}/project`, payload);
}


export async function postGenerateTeamForProject(
  projectId: number
): Promise<Team> {
  return apiPost<Team>(`/projects/${projectId}/generate-team`, {});
}


export async function postRespondToInvite(
  teamId: number,
  userId: number,
  status: "accepted" | "rejected"
): Promise<string> {
  return apiPost<string>(
    `/teams/team-invites/${teamId}/respond?user_id=${userId}`,
    { status }
  );
}


export async function fetchTeamById(teamId: number): Promise<Team> {
  return apiGet<Team>(`/teams/${teamId}`);
}