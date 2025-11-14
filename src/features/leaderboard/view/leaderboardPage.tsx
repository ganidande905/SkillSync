// src/features/leaderboard/view/leaderboardPage.tsx

import { useEffect, useState } from "react";
import {
  getLeaderboardData,
  type LeaderboardUser,
} from "../controller/leaderboardController";
import "../styles/leaderboard.css";

type LeaderboardRow = LeaderboardUser & {
  rank: number;
  isCurrentUser: boolean;
};

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentRank, setCurrentRank] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState<number | null>(null);

  const currentUserEmail = (
    localStorage.getItem("userEmail") || ""
  ).toLowerCase();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const list: LeaderboardUser[] = await getLeaderboardData();

        const sorted = [...list].sort((a, b) => b.score - a.score);


        const enriched: LeaderboardRow[] = sorted.map((u, idx) => {
          const isCurrentUser =
            !!currentUserEmail &&
            u.email.toLowerCase() === currentUserEmail;

          return {
            ...u,
            rank: idx + 1,
            isCurrentUser,
          };
        });

        setRows(enriched);

        const me = enriched.find((r) => r.isCurrentUser);
        setCurrentRank(me ? me.rank : null);
        setCurrentScore(me ? me.score : null);
      } catch (err) {
        console.error(err);
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentUserEmail]);

  if (loading) {
    return (
      <div className="leaderboard-content">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <div className="leaderboard-subtitle">
          See how you stack up against other SkillSync users
        </div>
        <div className="leaderboard-loading">Loading leaderboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-content">
        <h1 className="leaderboard-title">Leaderboard</h1>
        <div className="leaderboard-subtitle">
          See how you stack up against other SkillSync users
        </div>
        <div className="leaderboard-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-content">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="leaderboard-subtitle">
        See how you stack up against other SkillSync users
      </div>

      <div className="leaderboard-stats-row">
        <div className="leaderboard-stat-card">
          <div className="leaderboard-stat-icon stat-yellow">🏆</div>
          <div className="leaderboard-stat-value">
            {currentRank ? `#${currentRank}` : "—"}
          </div>
          <div className="leaderboard-stat-label">Your Rank</div>
        </div>

        <div className="leaderboard-stat-card">
          <div className="leaderboard-stat-icon stat-blue">⭐</div>
          <div className="leaderboard-stat-value">
            {currentScore !== null ? currentScore : "—"}
          </div>
          <div className="leaderboard-stat-label">Your Score</div>
        </div>

        <div className="leaderboard-stat-card">
          <div className="leaderboard-stat-icon stat-purple">👥</div>
          <div className="leaderboard-stat-value">{rows.length}</div>
          <div className="leaderboard-stat-label">Total Users</div>
        </div>
      </div>

      <div className="leaderboard-section">
        <div className="leaderboard-section-heading">Top users</div>

        <div className="leaderboard-toplist">
          {rows.map((row) => (
            <div
              key={row.id}
              className={
                "leaderboard-usercard" +
                (row.isCurrentUser
                  ? " leaderboard-usercard-highlight"
                  : "")
              }
            >
              <div className="leaderboard-usercard-left">
                <span className="leaderboard-usercard-rank">
                  #{row.rank}
                </span>
                <span className="leaderboard-usercard-avatar">
                  {getInitials(row.name)}
                </span>
                <div>
                  <div className="leaderboard-usercard-name">
                    {row.name}
                    {row.isCurrentUser && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.75rem",
                          padding: "0.1rem 0.5rem",
                          borderRadius: "999px",
                          background: "rgba(96,165,250,0.18)",
                          border: "1px solid rgba(129,140,248,0.8)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        You
                      </span>
                    )}
                  </div>
                  <div className="leaderboard-usercard-role">
                    {row.email}
                  </div>
                </div>
              </div>

              <div className="leaderboard-usercard-score">
                <div>{row.score}</div>
              </div>
            </div>
          ))}

          {rows.length === 0 && (
            <div className="leaderboard-empty">
              No users on the leaderboard yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function getInitials(name: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
}