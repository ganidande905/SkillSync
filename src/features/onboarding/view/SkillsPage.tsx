import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData, skillCategories } from "../model/onboardingModel";

interface SkillWithProficiency {
  name: string;
  proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

const SkillsPage: React.FC = () => {
  const navigate = useNavigate();

  // Load previously saved skills with proficiency
  const [skillsWithProficiency, setSkillsWithProficiency] = useState<SkillWithProficiency[]>(
    onboardingData.skillsWithProficiency || []
  );
  const [input, setInput] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Update onboardingData whenever skills change
  useEffect(() => {
    onboardingData.skillsWithProficiency = skillsWithProficiency;
  }, [skillsWithProficiency]);

  // Toggle (select/unselect) a skill
  const toggleSkill = (skill: string) => {
    setSkillsWithProficiency((prev) => {
      const exists = prev.find((s) => s.name === skill);
      if (exists) {
        return prev.filter((s) => s.name !== skill);
      } else {
        return [...prev, { name: skill, proficiency: "Beginner" }];
      }
    });
  };

  // Update proficiency for a skill
  const updateProficiency = (
    skill: string,
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  ) => {
    setSkillsWithProficiency((prev) =>
      prev.map((s) => (s.name === skill ? { ...s, proficiency } : s))
    );
  };

  // Add a custom skill
  const handleAdd = () => {
    const newSkill = input.trim();
    if (!newSkill) return;

    // Prevent duplicates
    if (skillsWithProficiency.find((s) => s.name === newSkill)) {
      setInput("");
      return;
    }

    setSkillsWithProficiency((prev) => [
      ...prev,
      { name: newSkill, proficiency: "Beginner" },
    ]);
    setInput("");
  };

  // Predefined skills
  const predefinedSkills = skillCategories
    .slice(0, 4)
    .flatMap((category) => category.items.slice(0, 8));

  // Custom skills = ones not in predefined list
  const customSkills = skillsWithProficiency
    .filter((s) => !predefinedSkills.includes(s.name))
    .map((s) => s.name);

  const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];

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
        <p>Choose your technical and soft skills, and select your proficiency level.</p>

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
              className={`tag ${skillsWithProficiency.find((s) => s.name === skill) ? "selected" : ""}`}
              onClick={() => {
                toggleSkill(skill);
                setSelectedSkill(null);
              }}
            >
              {skill}
            </button>
          ))}

          {/* Custom skills */}
          {customSkills.map((skill) => (
            <button
              key={skill}
              className="tag selected"
              onClick={() => {
                toggleSkill(skill);
                setSelectedSkill(null);
              }}
            >
              {skill} ✕
            </button>
          ))}
        </div>

        {/* Proficiency Selector */}
        {skillsWithProficiency.length > 0 && (
          <div style={{ marginTop: "2rem", textAlign: "left" }}>
            <h3 style={{ marginBottom: "1rem" }}>Set Proficiency Levels</h3>
            {skillsWithProficiency.map((skill) => (
              <div
                key={skill.name}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                }}
              >
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  {skill.name}
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {proficiencyLevels.map((level) => (
                    <button
                      key={level}
                      onClick={() =>
                        updateProficiency(
                          skill.name,
                          level as "Beginner" | "Intermediate" | "Advanced" | "Expert"
                        )
                      }
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        background:
                          skill.proficiency === level
                            ? "#3f82ff"
                            : "rgba(255, 255, 255, 0.1)",
                        color: "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        fontSize: "0.85rem",
                      }}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="buttons">
          <button className="back-btn" disabled>
            Back
          </button>
          <button
            className="next-btn"
            onClick={() => navigate("/onboarding/interests")}
            disabled={skillsWithProficiency.length === 0}
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SkillsPage;
