// src/features/teams/view/teamspage.tsx
import React from "react";
import { getTeamsData } from "../controller/teamsController";
import "../styles/teams.css";

export default function TeamsPage() {
  const { teamMatch, matches } = getTeamsData();

  return (
    <div className="teams-content">
      <div className="teams-heading">
        <h1>Find Your Perfect Team</h1>
        <div className="teams-desc">Discover teams that match your skills and interests</div>
        <div className="teams-status">1 teams matched · 2 remaining</div>
      </div>
      <div className="teams-card">
        <div className="teams-title-row">
          <div>
            <span className="teams-title">{teamMatch.name}</span>
            <span className="teams-subtitle">{teamMatch.desc}</span>
          </div>
          <span className="teams-match-badge">{teamMatch.match} match</span>
        </div>
        <div className="teams-about">{teamMatch.about}</div>
        <div className="teams-label">Skills They Need</div>
        <div className="teams-tags-row">
          {teamMatch.skillsNeeded.map(tag => <span key={tag} className="teams-tag">{tag}</span>)}
        </div>
        <div className="teams-label">Team Members ({teamMatch.members.length})</div>
        <div className="teams-members-row">
          {teamMatch.members.map((m, idx) => (
            <div className="teams-member-card" key={idx}>
              <span className="teams-member-initials">{m.initials}</span>
              <div>
                <div className="teams-member-name">{m.name}</div>
                <div className="teams-member-role">{m.role}</div>
                <div className="teams-member-tags">
                  {m.skills.map(skill => <span key={skill} className="teams-tag">{skill}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="teams-action-row">
          <button className="teams-pass-btn">✖ Pass</button>
          <button className="teams-join-btn">♡ Join Team</button>
        </div>
      </div>
      <div className="teams-matches-section">
        <div className="teams-label">Your Matches ({matches.length})</div>
        {matches.map((match, idx) => (
          <div className="teams-match-card" key={idx}>
            <span className="teams-match-title">{match.name}</span>
            <span className="teams-match-desc">{match.desc}</span>
            <button className="teams-chat-btn">💬 Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
}
