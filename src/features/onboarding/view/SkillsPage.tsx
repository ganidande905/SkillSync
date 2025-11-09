import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData, skillCategories } from "../model/onboardingModel";

const SkillsPage: React.FC = () => {
  const navigate = useNavigate();

  // Load previously saved skills (from onboardingData)
  const [skills, setSkills] = useState<string[]>(onboardingData.skills || []);
  const [input, setInput] = useState("");

  // Update onboardingData whenever skills change
  useEffect(() => {
    onboardingData.skills = skills;
  }, [skills]);

  // Toggle (select/unselect) a skill
  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  // Add a custom skill
  const handleAdd = () => {
    const newSkill = input.trim();
    if (!newSkill) return;

    // Prevent duplicates
    if (skills.includes(newSkill)) {
      setInput("");
      return;
    }

    setSkills((prev) => [...prev, newSkill]);
    setInput("");
  };

  // Predefined skills (from model)
  const predefinedSkills = skillCategories
    .slice(0, 4)
    .flatMap((category) => category.items.slice(0, 8));

  // Custom skills = ones not in predefined list
  const customSkills = skills.filter((s) => !predefinedSkills.includes(s));

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
        {/* Step Indicators */}
        <div className="step-indicators">
          <div className="dot active" onClick={() => navigate("/onboarding/skills")}></div>
          <div className="dot" onClick={() => navigate("/onboarding/interests")}></div>
          <div className="dot" onClick={() => navigate("/onboarding/projects")}></div>
        </div>

        <h2>Add Your Skills</h2>
        <p>Choose your technical and soft skills, or add your own below.</p>

        {/* Input Field */}
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a skill (e.g., React, Python)"
          />
          <button onClick={handleAdd}>+</button>
        </div>

        {/* Skill Tags */}
        <div className="tag-container">
          {/* Predefined skills */}
          {predefinedSkills.map((skill) => (
            <button
              key={skill}
              className={`tag ${skills.includes(skill) ? "selected" : ""}`}
              onClick={() => toggleSkill(skill)}
            >
              {skill}
            </button>
          ))}

          {/* Custom skills (added manually) */}
          {customSkills.map((skill) => (
            <button
              key={skill}
              className={`tag selected`}
              onClick={() => toggleSkill(skill)}
            >
              {skill} ✕
            </button>
          ))}
        </div>

        {/* Navigation */}
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
