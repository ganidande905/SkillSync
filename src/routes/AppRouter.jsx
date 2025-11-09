import Login from "../features/auth/view/loginPage";
import Register from "../features/auth/view/RegisterPage";
import Dashboard from "../features/dashboard/view/dashBoardScreen";
import SkillsPage from "../features/onboarding/view/SkillsPage";
import AddInterestsPage from "../features/onboarding/view/AddInterestsPage";
import AddProjectsPage from "../features/onboarding/view/AddProjectsPage";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/onboarding/skills" element={<SkillsPage />} />
        <Route path="/onboarding/interests" element={<AddInterestsPage />} />
        <Route path="/onboarding/projects" element={<AddProjectsPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}