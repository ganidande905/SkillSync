import { apiGet, apiPost } from "../../../api/client";
import type {
  Team,
  TeamInvite,
  ProjectCreate,
  ProjectSummary,
  TeamsOverview,
  ProjectOut,
} from "../model/teamsModel";


export async function loadTeamsOverview(userId: number): Promise<TeamsOverview> {
  const invites = await apiGet<TeamInvite[]>(`/teams/team-invites/${userId}`);
  const projects = await apiGet<ProjectSummary[]>(
    `/projects/${userId}/projects`
  );
  return { invites, projects };
}

export async function createProjectWithUser(
  userId: number,
  payload: ProjectCreate
): Promise<ProjectOut> {
  return apiPost<ProjectOut>(`/projects/${userId}/project`, payload);
}

export async function generateTeamForProject(projectId: number): Promise<Team> {
  return apiPost<Team>(`/projects/${projectId}/generate-team`, {});
}

export async function respondToTeamInvite(
  teamId: number,
  userId: number,
  status: "accepted" | "rejected"
) {
  return apiPost<string>(
    `/teams/team-invites/${teamId}/respond?user_id=${userId}`,
    { status }
  );
}

export async function findTeamById(teamId: number): Promise<Team> {
  return apiGet<Team>(`/teams/${teamId}`);
}