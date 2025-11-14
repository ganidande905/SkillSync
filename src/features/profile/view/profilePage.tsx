/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadProfile } from "../controller/profileController";
import "../styles/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const userId = Number(localStorage.getItem("userId") || 0);
  const userName = localStorage.getItem("userName") || "SkillSync user";
  const userEmail = localStorage.getItem("userEmail") || "";

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData2() {
      try {
        setLoading(true);
        const profile = await loadProfile(userId, userName, userEmail);
        setData(profile);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      fetchData2();
    }
  }, [userId, userName, userEmail]);

  if (loading) {
    return <div className="profile-loading">Loading profile…</div>;
  }

  if (error || !data) {
    return (
      <div className="profile-loading">
        {error || "Unable to load profile"}
      </div>
    );
  }

  return (
    <div className="profile-shell">
      <h1 className="profile-title">{data.name}</h1>
      <div className="profile-email">{data.email}</div>

      <div className="profile-topstats">
        <div className="profile-topstat-card">
          <div className="profile-topstat-value">{data.projectsCount}</div>
          <div className="profile-topstat-label">Projects</div>
        </div>
        <div className="profile-topstat-card">
          <div className="profile-topstat-value">{data.teamsAccepted}</div>
          <div className="profile-topstat-label">Teams Joined</div>
        </div>
        <div className="profile-topstat-card">
          <div className="profile-topstat-value">{data.teamsPending}</div>
          <div className="profile-topstat-label">Pending Invites</div>
        </div>

        <button
          className="profile-edit-btn"
          onClick={() => navigate("/onboarding/skills")}
        >
          Edit Profile
        </button>
      </div>

      {/* Skills */}
      <div className="profile-section glass">
        <div className="profile-section-title">
          Skills <span className="profile-edit-icon">✏️</span>
        </div>
        <div className="profile-tags">
          {data.skills.map((s: string) => (
            <span className="profile-tag" key={s}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="profile-section glass">
        <div className="profile-section-title">
          Interests <span className="profile-edit-icon">✏️</span>
        </div>
        <div className="profile-tags">
          {data.interests.map((i: string) => (
            <span className="profile-tag" key={i}>
              {i}
            </span>
          ))}
        </div>
      </div>

      {/* Past Projects */}
      <div className="profile-section glass">
        <div className="profile-section-title">
          Past Projects <span className="profile-edit-icon">✏️</span>
        </div>
        <div className="profile-projects">
          {data.pastProjects.map((p: any) => (
            <div className="profile-project-card" key={p.id}>
              <div className="profile-project-title">{p.project_title}</div>
              <div className="profile-project-desc">{p.description}</div>
              <div className="profile-project-tech">
                {p.technologies_used}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="profile-section glass">
        <div className="profile-section-title">Recent Activity</div>
        <div className="profile-activity-list">
          {data.recentActivity.map((a: any, idx: number) => (
            <div className="profile-activity-item" key={idx}>
              <span
                className="profile-activity-dot"
                style={{ background: a.color }}
              />
              <span>{a.text}</span>
              <span className="profile-activity-time">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}