import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";

import { submitPastProjects } from "../controller/Onboardingcontroller";
import {
  onboardingData,
  type PastProject,
  saveOnboardingData,
} from "../model/onboardingModel";

const AddProjectsPage: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<PastProject[]>(() => {
    const stored = localStorage.getItem("projects");
    return stored ? JSON.parse(stored) : onboardingData.projects || [];
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    onboardingData.projects = projects;
    saveOnboardingData();
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!title.trim()) {
      setError("Please enter a project title.");
      return;
    }

    const newProject: PastProject = {
      title: title.trim(),
      description: description.trim(),
      technologies: technologies.trim(),
    };

    setProjects((prev) => [...prev, newProject]);

    setTitle("");
    setDescription("");
    setTechnologies("");
    setError("");
  };

  const removeProject = (index: number) => {
    const updated = [...projects];
    updated.splice(index, 1);
    setProjects(updated);
  };

  const handleFinish = async () => {
    if (projects.length === 0) {
      setError("Please add at least one project before continuing.");
      return;
    }

    setSaving(true);
    setError("");

    onboardingData.projects = projects;
    saveOnboardingData();

    const res = await submitPastProjects(undefined, projects);

    setSaving(false);

    if (!res.success) {
      setError(res.message || "Failed to save projects");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <motion.div
      className="onboarding-page"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* background orbs + noise */}
      <div className="onboarding-orb orb-1" />
      <div className="onboarding-orb orb-2" />
      <div className="onboarding-noise" />

      {/* top header */}
      <header className="onboarding-header">
        <span className="onboarding-logo-pill">
          <span className="onboarding-dot" />
          <span className="onboarding-logo-text">SkillSync</span>
        </span>
        <span className="onboarding-step-label">Step 3 · Projects</span>
      </header>

      <div className="onboarding-shell">
        {/* Left hero text */}
        <section className="onboarding-hero">
          <h1 className="onboarding-title">Show us what you&apos;ve built.</h1>
          <p className="onboarding-subtitle">
            Add the projects you&apos;re proud of—coursework, hackathons, open
            source, or personal builds. This helps SkillSync understand the kind
            of work you actually enjoy doing.
          </p>

          <div className="onboarding-status-chip">
            <span className="status-pulse" />
            <span>
              Projects are synced to your profile and can power future matches.
            </span>
          </div>
        </section>

        {/* Right glass card */}
        <section className="onboarding-card">
          {/* Step dots */}
          <div className="step-indicators">
            <button
              type="button"
              className="step-dot"
              onClick={() => navigate("/onboarding/skills")}
            />
            <button
              type="button"
              className="step-dot"
              onClick={() => navigate("/onboarding/interests")}
            />
            <button
              type="button"
              className="step-dot active"
              onClick={() => navigate("/onboarding/projects")}
            />
          </div>

          <div className="onboarding-card-header">
            <h2>Past projects</h2>
            <p>Tell us about the projects you’ve worked on or contributed to.</p>
          </div>

          {/* Input block */}
          <div className="project-input-group">
            <input
              type="text"
              className="project-input"
              placeholder="Project title · e.g. SkillSync Backend"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="project-textarea"
              placeholder="Short description · what did you build, solve, or learn?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="text"
              className="project-input"
              placeholder="Technologies used · e.g. FastAPI, PostgreSQL, Docker"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
            />

            <button
              type="button"
              className="project-add-btn"
              onClick={addProject}
              disabled={saving}
            >
              Add project
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="projects-list">
            {projects.length > 0 ? (
              projects.map((proj, i) => (
                <div key={i} className="project-card">
                  <div className="project-header">
                    <h3 className="project-title">{proj.title}</h3>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeProject(i)}
                    >
                      ✕
                    </button>
                  </div>

                  {proj.description && (
                    <p className="project-desc">{proj.description}</p>
                  )}
                  {proj.technologies && (
                    <p className="project-tech">
                      <span className="project-tech-label">
                        Technologies
                      </span>
                      <span className="project-tech-value">
                        {proj.technologies}
                      </span>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="no-projects">
                No projects added yet. Start with one you&apos;re proud of.
              </p>
            )}
          </div>

          <div className="buttons">
            <button
              className="back-btn"
              onClick={() => navigate("/onboarding/interests")}
              disabled={saving}
            >
              Back
            </button>
            <button
              className="next-btn"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? "Saving..." : "Finish"}
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AddProjectsPage;