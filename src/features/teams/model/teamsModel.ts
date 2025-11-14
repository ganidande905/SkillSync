export type ProficiencyLevel = "beginner" | "intermediate" | "advanced";

export interface ProjectSkillRequirementCreate {
  skill_name: string;
  min_proficiency_level: ProficiencyLevel | null;
  weight: number | null;
}

export interface ProjectSkillRequirementOut
  extends ProjectSkillRequirementCreate {
  id: number;
  project_id: number;
}

export interface ProjectBase {
  project_name: string;
  description: string;
  repository_url: string;
  requirements: string | null;
}

export interface ProjectOut extends ProjectBase {
  id: number;
  user_id: number | null;
  last_commit_message: string | null;
  last_commit_sha: string | null;
  last_commit_url: string | null;
  skill_requirements: ProjectSkillRequirementOut[];
}

export interface ProjectSummary {
  id: number;
  project_name: string;
  description: string;
}

/**
 * Mirrors ProjectCreate in backend:
 * ProjectBase + skill_requirements: list[ProjectSkillRequirementBase]
 */
export interface ProjectCreate extends ProjectBase {
  skill_requirements: ProjectSkillRequirementCreate[];
}

export interface TeamInvite {
  id: number;
  user_id: number;
  role: string;
  status: "pending" | "accepted" | "rejected";
  team_id?: number;
}

export interface TeamMember {
  id: number;
  user_id: number;
  role: string;
  status: "pending" | "accepted" | "rejected";
}

export interface Team {
  id: number;
  team_name: string;
  description: string;
  project_id: number;
  creator_id: number;
  members: TeamMember[];
}

export interface TeamsOverview {
  invites: TeamInvite[];
  projects: ProjectSummary[];
}