import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SkillsPage from "../features/onboarding/view/SkillsPage";
import AddInterestsPage from "../features/onboarding/view/AddInterestsPage";
import AddProjectsPage from "../features/onboarding/view/AddProjectsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/onboarding/skills" replace />} />

        {/* Instant Page Load — No animations */}
        <Route path="/onboarding/skills" element={<SkillsPage />} />
        <Route path="/onboarding/interests" element={<AddInterestsPage />} />
        <Route path="/onboarding/projects" element={<AddProjectsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
