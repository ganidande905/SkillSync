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
    return stored
      ? JSON.parse(stored)
      : onboardingData.projects || [];
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

    // 🎉 Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <motion.div
      className="onboarding-container"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="logo">SKILLSYNC</h1>

      <div className="onboarding-card">
        <div className="step-indicators">
          <div className="dot" onClick={() => navigate("/onboarding/skills")}></div>
          <div className="dot" onClick={() => navigate("/onboarding/interests")}></div>
          <div className="dot active" onClick={() => navigate("/onboarding/projects")}></div>
        </div>

        <h2>Past Projects</h2>
        <p>Tell us about the projects you’ve worked on or contributed to.</p>

        <div className="input-group vertical">
          <input
            type="text"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Short Description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="text"
            placeholder="Technologies Used (comma-separated)"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />

          <button type="button" onClick={addProject}>
            Add Project
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="projects-list">
          {projects.length > 0 ? (
            projects.map((proj, i) => (
              <div key={i} className="project-card">
                <div className="project-header">
                  <h3>{proj.title}</h3>
                  <span className="remove-btn" onClick={() => removeProject(i)}>
                    ✕
                  </span>
                </div>

                {proj.description && <p className="desc">{proj.description}</p>}
                {proj.technologies && (
                  <p className="tech">
                    <strong>Technologies:</strong> {proj.technologies}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="no-projects">No projects added yet.</p>
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
      </div>
    </motion.div>
  );
};

export default AddProjectsPage;