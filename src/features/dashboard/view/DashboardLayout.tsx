// src/features/dashboard/view/DashboardLayout.tsx
import React, { useState } from "react";
import Navbar from "../../navbar/view/navbar";
import DashBoardScreen from "./dashBoardScreen"; // 
import ProfilePage from "../../profile/view/profilePage";
import TeamPage from "../../teams/view/teamsPage";
import LeaderboardPage from "../../leaderboard/view/leaderboardPage";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  let PageComponent = DashBoardScreen;

  if (activePage === "profile") PageComponent = ProfilePage;
  if (activePage === "teams") PageComponent = TeamPage;
  if (activePage === "leaderboard") PageComponent = LeaderboardPage;
  return (
    <div style={{ display: "flex" }}>
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <div style={{ flex: 1, marginLeft: 240 }}>
        <PageComponent />
      </div>
    </div>
  );
}
