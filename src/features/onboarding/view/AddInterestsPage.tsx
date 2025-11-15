import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData, interestCategories } from "../model/onboardingModel";
import { submitInterests } from "../controller/Onboardingcontroller";

const AddInterestsPage: React.FC = () => {
  const navigate = useNavigate();

  const [interests, setInterests] = useState<string[]>(() => {
    const stored = localStorage.getItem("interests");
    return stored ? JSON.parse(stored) : onboardingData.interests || [];
  });

  const [input, setInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    onboardingData.interests = interests;
    localStorage.setItem("interests", JSON.stringify(interests));
  }, [interests]);

  const toggleInterest = (interest: string) => {
    setError("");
    const updated = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    setInterests(updated);
  };

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
    setInput("");
  };

  const handleNext = async () => {
    setSaving(true);
    setError("");

    const res = await submitInterests(undefined, interests);

    setSaving(false);

    if (!res.success) {
      setError(res.message || "Failed to save interests");
      return;
    }

    navigate("/onboarding/projects");
  };

  // flatten suggestion list (only first 3 categories, first 8 each)
  const allSuggested = interestCategories
    .slice(0, 3)
    .flatMap((category) => category.items.slice(0, 8));

  const selectedSuggested = interests.filter((i) => allSuggested.includes(i));
  const customInterests = interests.filter((i) => !allSuggested.includes(i));
  const remainingSuggestions = allSuggested.filter(
    (i) => !interests.includes(i)
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

      {/* top header */}
      <header className="onboarding-header">
        <span className="onboarding-logo-pill">
          <span className="onboarding-dot" />
          <span className="onboarding-logo-text">SkillSync</span>
        </span>
        <span className="onboarding-step-label">Step 2 · Interests</span>
      </header>

      <div className="onboarding-shell">
        {/* left hero */}
        <section className="onboarding-hero">
          <h1 className="onboarding-title">What keeps you curious?</h1>
          <p className="onboarding-subtitle">
            Choose the topics, domains, and areas you genuinely enjoy exploring.
            This helps SkillSync suggest teams and projects that you’ll actually
            want to work on.
          </p>

          <div className="onboarding-status-chip">
            <span className="status-pulse" />
            <span>Interests power your recommendations and matches.</span>
          </div>
        </section>

        {/* right glass card */}
        <section className="onboarding-card">
          {/* step dots */}
          <div className="step-indicators">
            <button
              type="button"
              className="step-dot"
              onClick={() => navigate("/onboarding/skills")}
            />
            <button
              type="button"
              className="step-dot active"
              onClick={() => navigate("/onboarding/interests")}
            />
            <button
              type="button"
              className="step-dot"
              onClick={() => navigate("/onboarding/projects")}
            />
          </div>

          <div className="onboarding-card-header">
            <h2>Share your interests</h2>
            <p>Pick a few topics or areas that excite you.</p>
          </div>

          {error && <p className="error-text">{error}</p>}

          {/* Selected interests */}
          {(selectedSuggested.length > 0 || customInterests.length > 0) && (
            <div className="selected-skills-block">
              <p className="selected-label">Selected interests</p>
              <div className="selected-skills-grid">
                {[...selectedSuggested, ...customInterests].map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    className="tag tag-selected"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* custom interest input */}
          <div className="input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add an interest (e.g., AI, Web, Mobile)"
              className="skill-input"
            />
            <button
              type="button"
              className="add-skill-btn"
              onClick={handleAdd}
            >
              Add
            </button>
          </div>

          {/* suggestions */}
          <div className="suggested-block">
            <p className="suggested-label">Quick add from suggestions</p>
            <div className="tag-container">
              {remainingSuggestions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className="tag"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* navigation */}
          <div className="buttons">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/onboarding/skills")}
              disabled={saving}
            >
              Back
            </button>
            <button
              type="button"
              className="next-btn"
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? "Saving..." : "Next"}
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default AddInterestsPage;