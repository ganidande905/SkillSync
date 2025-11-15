import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData, skillCategories } from "../model/onboardingModel";
import { submitSkills } from "../controller/Onboardingcontroller";

type SkillLevel = "beginner" | "intermediate" | "advanced";

interface SelectedSkill {
  name: string;
  level: SkillLevel;
}

const AddSkillsPage: React.FC = () => {
  const navigate = useNavigate();

  const [skills, setSkills] = useState<SelectedSkill[]>(() => {
    const stored = localStorage.getItem("skills");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return onboardingData.skills || [];
      }
    }
    return onboardingData.skills || [];
  });

  const [input, setInput] = useState("");
  const [defaultLevel, setDefaultLevel] = useState<SkillLevel>("intermediate");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onboardingData.skills = skills;
    localStorage.setItem("skills", JSON.stringify(skills));
  }, [skills]);

  const upsertSkill = (name: string, level?: SkillLevel) => {
    setError("");
    const trimmed = name.trim();
    if (!trimmed) return;

    const chosenLevel = level || defaultLevel;
    const existingIndex = skills.findIndex((s) => s.name === trimmed);

    if (existingIndex >= 0) {
      const updated = [...skills];
      updated[existingIndex] = { ...updated[existingIndex], level: chosenLevel };
      setSkills(updated);
    } else {
      setSkills([...skills, { name: trimmed, level: chosenLevel }]);
    }
  };

  const removeSkill = (name: string) => {
    setSkills(skills.filter((s) => s.name !== name));
  };

  const handleAddInputSkill = () => {
    if (!input.trim()) return;
    upsertSkill(input.trim(), defaultLevel);
    setInput("");
  };

  const handleChangeLevel = (name: string, level: SkillLevel) => {
    const updated = skills.map((s) =>
      s.name === name ? { ...s, level } : s
    );
    setSkills(updated);
  };

  const handleNext = async () => {
    setSaving(true);
    setError("");

    const res = await submitSkills(undefined, skills);

    setSaving(false);

    if (!res.success) {
      setError(res.message || "Failed to save skills");
      return;
    }

    navigate("/onboarding/interests");
  };

  const allSuggested = skillCategories.flatMap((category) => category.items);
  const selectedNames = new Set(skills.map((s) => s.name));
  const remainingSuggestions = allSuggested.filter(
    (name) => !selectedNames.has(name)
  );

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

      <header className="onboarding-header">
        <span className="onboarding-logo-pill">
          <span className="onboarding-dot" />
          <span className="onboarding-logo-text">SkillSync</span>
        </span>
        <span className="onboarding-step-label">Step 1 · Skills</span>
      </header>

      <div className="onboarding-shell">
        <section className="onboarding-hero">
          <h1 className="onboarding-title">Tell us what you&apos;re good at.</h1>
          <p className="onboarding-subtitle">
            Add the technologies and tools you&apos;re comfortable with, then
            set how confident you feel with each one. This helps SkillSync match
            you with the right teams and projects.
          </p>

          <div className="onboarding-status-chip">
            <span className="status-pulse" />
            <span>Your skills are stored locally first and synced securely.</span>
          </div>
        </section>

        <section className="onboarding-card">
          {/* Step dots */}
          <div className="step-indicators">
            <button
              type="button"
              className="step-dot active"
              onClick={() => navigate("/onboarding/skills")}
            />
            <button
              type="button"
              className="step-dot"
              onClick={() => navigate("/onboarding/interests")}
            />
            <button
              type="button"
              className="step-dot"
              onClick={() => navigate("/onboarding/projects")}
            />
          </div>

          <div className="onboarding-card-header">
            <h2>Add your skills</h2>
            <p>Select your skills and choose a proficiency level for each.</p>
          </div>

          {error && <p className="error-text">{error}</p>}

          {skills.length > 0 && (
            <div className="selected-skills-block">
              <p className="selected-label">Selected skills</p>
              <div className="selected-skills-grid">
                {skills.map((skill) => (
                  <div key={skill.name} className="skill-chip">
                    <button
                      type="button"
                      className="tag tag-selected"
                      onClick={() => removeSkill(skill.name)}
                    >
                      <span className="tag-text">{skill.name}</span>
                      <span className="tag-close">×</span>
                    </button>
                    <select
                      className="level-select"
                      value={skill.level}
                      onChange={(e) =>
                        handleChangeLevel(
                          skill.name,
                          e.target.value as SkillLevel
                        )
                      }
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Default level */}
          <div className="default-level-row">
            <span className="default-label">
              Default level for new skills
            </span>
            <select
              className="default-select"
              value={defaultLevel}
              onChange={(e) =>
                setDefaultLevel(e.target.value as SkillLevel)
              }
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Input row */}
          <div className="input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a skill (e.g., FastAPI, React, Docker)"
              className="skill-input"
            />
            <button
              type="button"
              className="add-skill-btn"
              onClick={handleAddInputSkill}
            >
              Add
            </button>
          </div>

          {/* Suggested skills */}
          <div className="suggested-block">
            <p className="suggested-label">Quick add from suggestions</p>
            <div className="tag-container">
              {remainingSuggestions.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="tag"
                  onClick={() => upsertSkill(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="buttons">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/")}
              disabled={saving}
            >
              Skip for now
            </button>
            <button
              type="button"
              className="next-btn"
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? "Saving..." : "Continue"}
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AddSkillsPage;