import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData, skillCategories } from "../model/onboardingModel";

const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<string[]>(onboardingData.skills);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const toggleSkill = (skill: string) => {
    const updated = skills.includes(skill)
      ? skills.filter((s) => s !== skill)
      : [...skills, skill];
    setSkills(updated);
    onboardingData.skills = updated;
  };

  const handleAdd = () => {
    if (input.trim()) {
      const updated = [...skills, input.trim()];
      setSkills(updated);
      onboardingData.skills = updated;
      setInput("");
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
          <div className="dot active" onClick={() => navigate("/onboarding/skills")}></div>
          <div className="dot" onClick={() => navigate("/onboarding/interests")}></div>
          <div className="dot" onClick={() => navigate("/onboarding/projects")}></div>
        </div>

        <h2>Add Your Skills</h2>
        <p>Choose your technical and soft skills.</p>

        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a skill (e.g., React, Python)"
          />
          <button onClick={handleAdd}>+</button>
        </div>

        <div className="tag-container">
          {skillCategories.slice(0, 4).flatMap((category) =>
            category.items.slice(0, 8).map((skill) => (
              <button
                key={skill}
                className={`tag ${skills.includes(skill) ? "selected" : ""}`}
                onClick={() => toggleSkill(skill)}
              >
                {skill}
              </button>
            ))
          )}
        </div>

        <div className="buttons">
          <button className="back-btn" disabled>
            Back
          </button>
          <button className="next-btn" onClick={() => navigate("/onboarding/interests")}>
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsPage;
