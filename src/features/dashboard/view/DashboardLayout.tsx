import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../navbar/view/navbar";
import DashBoardScreen from "./dashBoardScreen";
import ProfilePage from "../../profile/view/profilePage";
import TeamPage from "../../teams/view/teamsPage";
import LeaderboardPage from "../../leaderboard/view/leaderboardPage";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userId = Number(localStorage.getItem("userId") || 0);
  const userName = localStorage.getItem("userName") || "SkillSync user";

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleGoTeams = () => setActivePage("teams");
  const handleGoLeaderboard = () => setActivePage("leaderboard");
  const handleGoSkills = () => {
    navigate("/onboarding/skills");
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let PageComponent: React.ComponentType<any> = () => (
    <DashBoardScreen
      userId={userId}
      userName={userName}
      onGoTeams={handleGoTeams}
      onGoLeaderboard={handleGoLeaderboard}
      onGoSkills={handleGoSkills}
    />
  );

  if (activePage === "profile") PageComponent = ProfilePage;
  if (activePage === "teams") PageComponent = TeamPage;
  if (activePage === "leaderboard") PageComponent = LeaderboardPage;

  if (!isLoggedIn) return null;

  return (
    <div className="dashboard-layout-root">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <div className="dashboard-layout-content">
        <PageComponent />
      </div>
    </div>
  );
}