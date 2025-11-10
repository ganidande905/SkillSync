import React from "react";
import { getDashboardData } from "../controller/dashboardController";
import "../styles/dashboard.css";

export default function DashBoardScreen() {
  const data = getDashboardData();
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Welcome back, {data.userName}!
      </h1>
      <p className="dashboard-subtext">
        Track your progress and grow your skills
      </p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-value">{data.activeTeams}</div>
          <div className="dashboard-card-label">Active Teams</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">{data.skillScore}</div>
          <div className="dashboard-card-label">Skill Score</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">#{data.globalRank}</div>
          <div className="dashboard-card-label">Global Rank</div>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-value">{data.progressRate}</div>
          <div className="dashboard-card-label">This Week</div>
        </div>
      </div>

      <div className="dashboard-progress-row">
        <div className="dashboard-progress-card">
          <div className="dashboard-progress-title">Skill Development</div>
          <div className="dashboard-progress-percent">{data.skillDevelopment}%</div>
          <div className="dashboard-progress-desc">
            You're making great progress! Keep learning to unlock new opportunities.
          </div>
        </div>
        <div className="dashboard-progress-card">
          <div className="dashboard-progress-title">Team Performance</div>
          <div className="dashboard-progress-percent">{data.teamPerformance}%</div>
          <div className="dashboard-progress-desc">
            Your teams are performing well. Keep up the collaborative spirit!
          </div>
        </div>
      </div>

      <div className="dashboard-actions-card">
        <div className="dashboard-actions-title">What would you like to do?</div>
        <div className="dashboard-actions-buttons">
          <button className="dashboard-action-btn">Find Teams</button>
          <button className="dashboard-action-btn">Update Skills</button>
          <button className="dashboard-action-btn">View Leaderboard</button>
        </div>
      </div>

      <div className="dashboard-info-card">
        <div className="dashboard-info-title">Your Skills</div>
        <div className="dashboard-info-tags">
          {data.skills.length > 0 ? (
            data.skills.map((skill, idx) => (
              <span key={idx} className="dashboard-tag">{skill}</span>
            ))
          ) : (
            <span className="dashboard-tag-none">No skills added yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
