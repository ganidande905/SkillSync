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

  // flatten suggestion list (only first 3 categories, first 8 each like before)
  const allSuggested = interestCategories
    .slice(0, 3)
    .flatMap((category) => category.items.slice(0, 8));

  // selected interests that came from suggestions
  const selectedSuggested = interests.filter((i) => allSuggested.includes(i));

  // custom interests that user typed
  const customInterests = interests.filter((i) => !allSuggested.includes(i));

  // suggestions still available (not yet selected)
  const remainingSuggestions = allSuggested.filter(
    (i) => !interests.includes(i)
  );

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
          <button
            type="button"
            className="dot"
            onClick={() => navigate("/onboarding/skills")}
          />
          <button
            type="button"
            className="dot active"
            onClick={() => navigate("/onboarding/interests")}
          />
          <button
            type="button"
            className="dot"
            onClick={() => navigate("/onboarding/projects")}
          />
        </div>

        <h2>Share Your Interests</h2>
        <p>Pick a few topics or areas that excite you.</p>

        {error && <p className="error-text">{error}</p>}

        {/* 🔹 Selected interests “moved” to this top area */}
        {(selectedSuggested.length > 0 || customInterests.length > 0) && (
          <div className="selected-interests">
            <p className="selected-label">Selected interests:</p>
            <div className="tag-container">
              {[...selectedSuggested, ...customInterests].map((interest) => (
                <button
                  key={interest}
                  type="button"
                  className="tag selected"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add an interest (e.g., AI, Web, Mobile)"
          />
          <button type="button" onClick={handleAdd}>
            +
          </button>
        </div>

        {/* 🔹 Suggestions (labels). Once clicked, they disappear from here and move up */}
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
      </div>
    </motion.div>
  );
};

export default AddInterestsPage;