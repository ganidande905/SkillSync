import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData } from "../model/onboardingModel";

const AddProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState(onboardingData.projects);
  const [project, setProject] = useState("");
  const navigate = useNavigate();

  const addProject = () => {
    if (project.trim()) {
      const updated = [...projects, project.trim()];
      setProjects(updated);
      onboardingData.projects = updated;
      setProject("");
    }
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
        <p>Tell us about projects you’ve worked on.</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Project Title and your role"
            value={project}
            onChange={(e) => setProject(e.target.value)}
          />
          <button onClick={addProject}>+</button>
        </div>

        <div className="chips">
          {projects.map((p, i) => (
            <div key={i} className="chip">{p}</div>
          ))}
        </div>

        <div className="buttons">
          <button className="back-btn" onClick={() => navigate("/onboarding/interests")}>
            Back
          </button>
          <button className="next-btn" onClick={() => alert("✅ Onboarding Completed!")}>
            Finish
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddProjectsPage;
