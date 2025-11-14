// src/features/teams/view/TeamsPage.tsx

import { useEffect, useState } from "react";
import {
  loadTeamsOverview,
  createProjectWithUser,
  generateTeamForProject,
  respondToTeamInvite,
  findTeamById,
} from "../controller/teamsController";
import type {
  Team,
  TeamInvite,
  ProjectCreate,
  ProjectSummary,
  ProficiencyLevel,
} from "../model/teamsModel";
import { apiGet } from "../../../api/client";
import "../styles/teams.css";

type UserOut = {
  id: number;
  name: string;
  email: string;
};

type SkillDraft = {
  name: string;
  level: ProficiencyLevel;
  weight: number;
};

export default function TeamsPage() {
  const userId = Number(localStorage.getItem("userId") || 0);

  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [generatedTeam, setGeneratedTeam] = useState<Team | null>(null);
  const [teamSearchResult, setTeamSearchResult] = useState<Team | null>(null);

  // cache of user_id -> name
  const [userNames, setUserNames] = useState<Record<number, string>>({});

  // project form
  const [projectForm, setProjectForm] = useState({
    project_name: "",
    description: "",
    repository_url: "",
    requirements: "",
  });

  // skill builder (UI only; we map to backend shape when sending)
  const [skills, setSkills] = useState<SkillDraft[]>([]);
  const [currentSkillName, setCurrentSkillName] = useState("");
  const [currentSkillLevel, setCurrentSkillLevel] =
    useState<ProficiencyLevel>("beginner");
  const [currentSkillWeight, setCurrentSkillWeight] = useState(5);

  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");

  // team search
  const [teamSearchId, setTeamSearchId] = useState("");
  const [teamSearchLoading, setTeamSearchLoading] = useState(false);
  const [teamSearchError, setTeamSearchError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- INITIAL LOAD -------------------- */

  useEffect(() => {
    async function fetchData() {
      if (!userId) {
        setLoading(false);
        setError("User not logged in");
        return;
      }

      try {
        setLoading(true);
        const { invites, projects } = await loadTeamsOverview(userId);
        setInvites(invites);
        setProjects(projects);
      } catch (err) {
        console.error(err);
        setError("Failed to load team data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

  const pendingInvites = invites.filter(
    (i) => i.status.toLowerCase() === "pending"
  );

  /* -------------------- USERNAME HELPERS -------------------- */

  async function fetchUserName(uId: number): Promise<string | null> {
    if (!uId) return null;
    if (userNames[uId]) return userNames[uId];

    try {
      const user = await apiGet<UserOut>(`/users/${uId}`);
      setUserNames((prev) => ({ ...prev, [uId]: user.name }));
      return user.name;
    } catch (err) {
      console.error("Failed to fetch user", uId, err);
      return null;
    }
  }

  async function preloadTeamMemberNames(team: Team) {
    const ids = Array.from(new Set(team.members.map((m) => m.user_id)));
    await Promise.all(ids.map((id) => fetchUserName(id)));
  }

  useEffect(() => {
    if (generatedTeam) preloadTeamMemberNames(generatedTeam);
  }, [generatedTeam]);

  useEffect(() => {
    if (teamSearchResult) preloadTeamMemberNames(teamSearchResult);
  }, [teamSearchResult]);

  /* -------------------- FORM HANDLERS -------------------- */

  function handleProjectChange(
    field: keyof typeof projectForm,
    value: string
  ) {
    setProjectForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddSkill(e: React.MouseEvent) {
    e.preventDefault();
    const trimmed = currentSkillName.trim();
    if (!trimmed) return;

    setSkills((prev) => [
      ...prev,
      {
        name: trimmed,
        level: currentSkillLevel,
        weight: currentSkillWeight,
      },
    ]);

    setCurrentSkillName("");
    setCurrentSkillLevel("beginner");
    setCurrentSkillWeight(5);
  }

  function handleRemoveSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    // build payload EXACTLY like backend ProjectCreate
    const payload: ProjectCreate = {
      project_name: projectForm.project_name.trim(),
      description: projectForm.description.trim(),
      repository_url: projectForm.repository_url.trim(),
      requirements: projectForm.requirements.trim() || "",
      skill_requirements: skills.map((s) => ({
        skill_name: s.name,
        min_proficiency_level: s.level,
        weight: s.weight,
      })),
    };

    try {
      setActionLoading(true);
      const created = await createProjectWithUser(userId, payload);

      setProjects((prev) => [
        ...prev,
        {
          id: created.id,
          project_name: created.project_name,
          description: created.description,
        },
      ]);

      // reset form + skills
      setProjectForm({
        project_name: "",
        description: "",
        repository_url: "",
        requirements: "",
      });
      setSkills([]);
      setCurrentSkillName("");
      setCurrentSkillLevel("beginner");
      setCurrentSkillWeight(5);
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleGenerateTeam() {
    if (!selectedProjectId || typeof selectedProjectId !== "number") return;

    try {
      setActionLoading(true);
      const team = await generateTeamForProject(selectedProjectId);
      setGeneratedTeam(team);
      setTeamSearchResult(null);
    } catch (err) {
      console.error(err);
      setError("Failed to generate team");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleInviteResponse(
    invite: TeamInvite,
    status: "accepted" | "rejected"
  ) {
    if (!userId) return;

    try {
      setActionLoading(true);
      const teamId = invite.team_id ?? invite.id;
      await respondToTeamInvite(teamId, userId, status);
      setInvites((prev) =>
        prev.map((i) => (i.id === invite.id ? { ...i, status } : i))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update invite");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSearchTeam() {
    const id = Number(teamSearchId);
    if (!id) {
      setTeamSearchError("Enter a valid team ID");
      return;
    }

    try {
      setTeamSearchLoading(true);
      setTeamSearchError(null);
      const team = await findTeamById(id);
      setTeamSearchResult(team);
      setGeneratedTeam(null);
    } catch (err) {
      console.error(err);
      setTeamSearchResult(null);
      setTeamSearchError("Team not found");
    } finally {
      setTeamSearchLoading(false);
    }
  }

  /* -------------------- RENDER HELPERS -------------------- */

  function renderMemberRow(member: Team["members"][number]) {
    const displayName =
      userNames[member.user_id] ?? `User #${member.user_id}`;

    const statusClass =
      member.status === "accepted"
        ? "status-accepted"
        : member.status === "pending"
        ? "status-pending"
        : "status-rejected";

    return (
      <div key={member.id} className="teams-member-row">
        <div className="teams-member-bubble">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="teams-member-details">
          <div className="teams-member-name">{displayName}</div>
          <div className="teams-member-role">{member.role}</div>
        </div>
        <div className={`teams-status-badge ${statusClass}`}>
          {member.status}
        </div>
      </div>
    );
  }

  function renderTeamCard(team: Team) {
    return (
      <div className="teams-team-card">
        <div className="teams-team-head">
          <div>
            <div className="teams-team-title">{team.team_name}</div>
            <div className="teams-team-sub">{team.description}</div>
          </div>
          <div className="teams-badge">
            {team.members.length} member
            {team.members.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="teams-team-invite-header">
          Invited members ({team.members.length})
        </div>

        <div className="teams-member-list">
          {team.members.map((m) => renderMemberRow(m))}
        </div>
      </div>
    );
  }

  /* -------------------- RENDER -------------------- */

  if (loading) {
    return <div className="teams-content">Loading teams…</div>;
  }

  if (error) {
    return <div className="teams-content">Error: {error}</div>;
  }

  return (
    <div className="teams-content">
      {/* HEADER */}
      <header className="teams-header">
        <h1 className="teams-title-main">Teams</h1>
        <p className="teams-subtitle">
          Create projects, define skill requirements, generate teams and see
          who&apos;s been invited.
        </p>
        <p className="teams-submeta">
          {pendingInvites.length} pending invite
          {pendingInvites.length !== 1 ? "s" : ""} · {projects.length} project
          {projects.length !== 1 ? "s" : ""}
        </p>
      </header>

      {/* TWO-COLUMN LAYOUT */}
      <div className="teams-two-column">
        {/* LEFT: invites + search */}
        <div className="teams-column teams-column-left">
          {/* Pending invites */}
          <section className="teams-section-card">
            <div className="teams-section-title">Pending invites</div>

            {pendingInvites.length === 0 && (
              <div className="teams-empty">
                No pending invites. Go build something cool 👀
              </div>
            )}

            {pendingInvites.map((invite) => {
              const name =
                userNames[invite.user_id] ?? `User #${invite.user_id}`;
              return (
                <div key={invite.id} className="teams-invite-card">
                  <div className="teams-invite-main">
                    <div className="teams-invite-name">{name}</div>
                    <div className="teams-invite-role">
                      Role: {invite.role}
                    </div>
                  </div>
                  <div className="teams-invite-actions">
                    <button
                      className="teams-btn-tertiary"
                      disabled={actionLoading}
                      onClick={() => handleInviteResponse(invite, "rejected")}
                    >
                      Decline
                    </button>
                    <button
                      className="teams-btn-primary"
                      disabled={actionLoading}
                      onClick={() => handleInviteResponse(invite, "accepted")}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}

            {/* All invites overview (who all got invites + status) */}
            {invites.length > 0 && (
              <div className="teams-all-invites">
                <div className="teams-all-invites-title">
                  All invitations
                </div>
                {invites.map((inv) => {
                  const name =
                    userNames[inv.user_id] ?? `User #${inv.user_id}`;
                  return (
                    <div key={inv.id} className="teams-all-invites-row">
                      <span className="teams-all-invites-name">{name}</span>
                      <span
                        className={`teams-all-invites-status status-${inv.status}`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Search team */}
          <section className="teams-section-card">
            <div className="teams-section-title">Search team by ID</div>
            <div className="teams-search-row">
              <input
                className="teams-input"
                placeholder="Enter team ID"
                value={teamSearchId}
                onChange={(e) => setTeamSearchId(e.target.value)}
              />
              <button
                className="teams-btn-secondary"
                onClick={handleSearchTeam}
                disabled={teamSearchLoading}
              >
                {teamSearchLoading ? "Searching…" : "Search"}
              </button>
            </div>

            {teamSearchError && (
              <div className="teams-error">{teamSearchError}</div>
            )}

            {teamSearchResult && (
              <div className="teams-team-wrapper">
                {renderTeamCard(teamSearchResult)}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: create project + skills + generate team */}
        <div className="teams-column teams-column-right">
          {/* Create project */}
          <section className="teams-section-card">
            <div className="teams-section-title">Create project</div>
            <form className="teams-form" onSubmit={handleCreateProject}>
              <input
                className="teams-input"
                placeholder="Project name"
                value={projectForm.project_name}
                onChange={(e) =>
                  handleProjectChange("project_name", e.target.value)
                }
                required
              />
              <textarea
                className="teams-input"
                placeholder="Short description"
                value={projectForm.description}
                onChange={(e) =>
                  handleProjectChange("description", e.target.value)
                }
                rows={2}
              />
              <input
                className="teams-input"
                placeholder="Repository URL"
                value={projectForm.repository_url}
                onChange={(e) =>
                  handleProjectChange("repository_url", e.target.value)
                }
              />
              <textarea
                className="teams-input"
                placeholder="What are you building? (requirements)"
                value={projectForm.requirements}
                onChange={(e) =>
                  handleProjectChange("requirements", e.target.value)
                }
                rows={2}
              />

              {/* Skill requirements builder */}
              <div className="teams-skill-builder-header">
                Skill requirements
                <span className="teams-skill-builder-sub">
                  Stored as <code>skill_name</code>,{" "}
                  <code>min_proficiency_level</code>,{" "}
                  <code>weight</code>.
                </span>
              </div>

              <div className="teams-skill-builder-row">
                <input
                  className="teams-input"
                  placeholder="Skill name (e.g. React)"
                  value={currentSkillName}
                  onChange={(e) => setCurrentSkillName(e.target.value)}
                />
                <select
                  className="teams-input"
                  value={currentSkillLevel}
                  onChange={(e) =>
                    setCurrentSkillLevel(
                      e.target.value as ProficiencyLevel
                    )
                  }
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  className="teams-input"
                  type="number"
                  min={1}
                  max={10}
                  value={currentSkillWeight}
                  onChange={(e) =>
                    setCurrentSkillWeight(Number(e.target.value) || 1)
                  }
                />
                <button
                  className="teams-btn-secondary"
                  onClick={handleAddSkill}
                  type="button"
                >
                  Add
                </button>
              </div>

              {skills.length > 0 && (
                <div className="teams-skill-list">
                  {skills.map((s, idx) => (
                    <div key={idx} className="teams-skill-pill">
                      <span className="teams-skill-pill-name">
                        {s.name}
                      </span>
                      <span className="teams-skill-pill-meta">
                        {s.level} · weight {s.weight}
                      </span>
                      <button
                        type="button"
                        className="teams-skill-pill-remove"
                        onClick={() => handleRemoveSkill(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                className="teams-btn-primary full-width"
                type="submit"
                disabled={actionLoading}
              >
                {actionLoading ? "Saving…" : "Create project"}
              </button>
            </form>
          </section>

          {/* Projects list */}
          <section className="teams-section-card">
            <div className="teams-section-title">Your projects</div>
            {projects.length === 0 && (
              <div className="teams-empty">
                No projects yet. Start by creating one above.
              </div>
            )}
            {projects.map((p) => (
              <div key={p.id} className="teams-project-card">
                <div className="teams-project-name">{p.project_name}</div>
                <div className="teams-project-desc">{p.description}</div>
              </div>
            ))}
          </section>

          {/* Generate team */}
          <section className="teams-section-card">
            <div className="teams-section-title">Generate team</div>
            {projects.length === 0 ? (
              <div className="teams-empty">
                Create a project before generating teams.
              </div>
            ) : (
              <div className="teams-generate-row">
                <select
                  className="teams-input"
                  value={selectedProjectId}
                  onChange={(e) =>
                    setSelectedProjectId(
                      e.target.value ? Number(e.target.value) : ""
                    )
                  }
                >
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.project_name}
                    </option>
                  ))}
                </select>
                <button
                  className="teams-btn-secondary"
                  onClick={handleGenerateTeam}
                  disabled={!selectedProjectId || actionLoading}
                >
                  {actionLoading ? "Generating…" : "Generate team"}
                </button>
              </div>
            )}

            {generatedTeam && (
              <div className="teams-team-wrapper">
                {renderTeamCard(generatedTeam)}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}