import { useEffect, useState } from "react";
import { getDashboardData } from "../controller/dashboardController";
import type { DashboardData } from "../model/dashboardModel";
import "../styles/dashboard.css";

interface DashBoardScreenProps {
  userId: number;
  userName: string;
  onGoTeams: () => void;
  onGoLeaderboard: () => void;
  onGoSkills: () => void;
}

export default function DashBoardScreen({
  userId,
  userName,
  onGoTeams,
  onGoLeaderboard,
  onGoSkills,
}: DashBoardScreenProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);
        const dashboardData = await getDashboardData(userId, userName);
        if (isMounted) setData(dashboardData);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load dashboard data"
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      isMounted = false;
    };
  }, [userId, userName]);

  if (loading) {
    return (
      <div className="dashboard-root">
        <div className="dashboard-shell">
          <div className="dashboard-loading">Booting up your dashboard…</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dashboard-root">
        <div className="dashboard-shell">
          <div className="dashboard-error-title">Something went wrong</div>
          <p className="dashboard-error-text">
            {error || "Unable to load dashboard data. Please try again later."}
          </p>
        </div>
      </div>
    );
  }

  const trimmedCommit =
    data.latestCommitMessage && data.latestCommitMessage.length > 90
      ? data.latestCommitMessage.slice(0, 87) + "…"
      : data.latestCommitMessage || "No commits yet";

  return (
    <div className="dashboard-root">
      <div className="dashboard-shell">

        <header className="dashboard-header">
          <div className="dashboard-header-left">
            <div className="dashboard-pill">SkillSync · Dashboard</div>
            <h1 className="dashboard-title">Welcome back, {data.userName}</h1>
            <p className="dashboard-subtext">
              One place to track your skills, teams and code activity.
            </p>
          </div>
          <div className="dashboard-header-right">
            <div className="dashboard-chip">
              <span className="dashboard-chip-label">Global Rank</span>
              <span className="dashboard-chip-value">#{data.globalRank}</span>
            </div>
            <div className="dashboard-chip">
              <span className="dashboard-chip-label">Skill Score</span>
              <span className="dashboard-chip-value">{data.skillScore}</span>
            </div>
          </div>
        </header>


        <section className="dashboard-main-grid">
          {/* LEFT COLUMN */}
          <div className="dashboard-metrics-col">
            <div className="dashboard-grid">
              <div className="dashboard-card accent-card">
                <div className="dashboard-card-label">Active teams</div>
                <div className="dashboard-card-value">{data.activeTeams}</div>
                <p className="dashboard-card-hint">
                  Collaborations you&apos;re currently part of.
                </p>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-label">Projects</div>
                <div className="dashboard-card-value">{data.projectsCount}</div>
                <p className="dashboard-card-hint">
                  Repos connected to your SkillSync profile.
                </p>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-label">Pending invites</div>
                <div className="dashboard-card-value">{data.pendingInvites}</div>
                <p className="dashboard-card-hint">
                  Teams waiting for your response.
                </p>
              </div>

              <div className="dashboard-card">
                <div className="dashboard-card-label">Skills tracked</div>
                <div className="dashboard-card-value">{data.skills.length}</div>
                <p className="dashboard-card-hint">
                  Keep this updated to get better matches.
                </p>
              </div>
            </div>

          </div>
          <div className="dashboard-progress-row">
            <div className="dashboard-progress-card">
              <div className="dashboard-progress-title">Profile at a glance</div>
              <div className="dashboard-profile-grid">
                <div className="dashboard-profile-stat">
                  <span className="dashboard-profile-label">Past projects</span>
                  <span className="dashboard-profile-value">
                    {data.pastProjectsCount}
                  </span>
                </div>
                <div className="dashboard-profile-stat">
                  <span className="dashboard-profile-label">Interests</span>
                  <span className="dashboard-profile-value">
                    {data.interestsCount}
                  </span>
                </div>
                <div className="dashboard-profile-stat">
                  <span className="dashboard-profile-label">Skills</span>
                  <span className="dashboard-profile-value">
                    {data.skills.length}
                  </span>
                </div>
              </div>
              <div className="dashboard-progress-desc">
                This is everything SkillSync currently knows about you.
              </div>
            </div>

            <div className="dashboard-progress-card">
              <div className="dashboard-progress-title">Team status</div>
              <div className="dashboard-profile-grid">
                <div className="dashboard-profile-stat">
                  <span className="dashboard-profile-label">Active teams</span>
                  <span className="dashboard-profile-value">
                    {data.activeTeams}
                  </span>
                </div>
                <div className="dashboard-profile-stat">
                  <span className="dashboard-profile-label">Pending invites</span>
                  <span className="dashboard-profile-value">
                    {data.pendingInvites}
                  </span>
                </div>
                <div className="dashboard-profile-stat">
                  <span className="dashboard-profile-label">Projects</span>
                  <span className="dashboard-profile-value">
                    {data.projectsCount}
                  </span>
                </div>
              </div>
              <div className="dashboard-progress-desc">
                Use this to see how plugged-in you are to the community.
              </div>
            </div>
          </div>

          <aside className="dashboard-side-col">
            <div className="dashboard-commit-card">
              <div className="dashboard-commit-label">Latest commit</div>
              <div className="dashboard-commit-message">{trimmedCommit}</div>
              <p className="dashboard-commit-sub">
                Pulled from your latest connected project.
              </p>
            </div>

            <div className="dashboard-actions-card glass">
              <div className="dashboard-actions-title">Quick actions</div>
              <div className="dashboard-actions-buttons">
                <button
                  className="dashboard-action-btn"
                  onClick={onGoTeams}
                >
                  Find teams
                </button>
                <button
                  className="dashboard-action-btn"
                  onClick={onGoSkills}
                >
                  Update skills
                </button>
                <button
                  className="dashboard-action-btn"
                  onClick={onGoLeaderboard}
                >
                  View leaderboard
                </button>
              </div>
              <p className="dashboard-actions-hint">
                Use these often – they&apos;re your daily entry points.
              </p>
            </div>

            <div className="dashboard-info-card glass">
              <div className="dashboard-info-title">Your skills</div>
              <div className="dashboard-info-tags">
                {data.skills.length > 0 ? (
                  data.skills.map((skill, idx) => (
                    <span key={idx} className="dashboard-tag">
                      {String(skill)}
                    </span>
                  ))
                ) : (
                  <span className="dashboard-tag-none">
                    No skills added yet. Start with your strongest 3.
                  </span>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}