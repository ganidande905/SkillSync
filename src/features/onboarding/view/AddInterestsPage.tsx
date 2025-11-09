import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../onboarding/styles/onboarding.css";
import { onboardingData, interestCategories } from "../model/onboardingModel";

const AddInterestsPage: React.FC = () => {
  const navigate = useNavigate();

  // Load from localStorage first, fallback to onboardingData
  const [interests, setInterests] = useState<string[]>(() => {
    const stored = localStorage.getItem("interests");
    return stored ? JSON.parse(stored) : onboardingData.interests || [];
  });

  const [input, setInput] = useState("");

  // Keep both onboardingData and localStorage synced
  useEffect(() => {
    onboardingData.interests = interests;
    localStorage.setItem("interests", JSON.stringify(interests));
  }, [interests]);

  const toggleInterest = (interest: string) => {
    const updated = interests.includes(interest)
      ? interests.filter((i) => i !== interest)
      : [...interests, interest];
    setInterests(updated);
  };

  const handleAdd = () => {
    if (input.trim() && !interests.includes(input.trim())) {
      const updated = [...interests, input.trim()];
      setInterests(updated);
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
          <div className="dot" onClick={() => navigate("/onboarding/skills")}></div>
          <div className="dot active" onClick={() => navigate("/onboarding/interests")}></div>
          <div className="dot" onClick={() => navigate("/onboarding/projects")}></div>
        </div>

        <h2>Share Your Interests</h2>
        <p>Pick a few topics or areas that excite you.</p>

        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add an interest (e.g., AI, Web, Mobile)"
          />
          <button onClick={handleAdd}>+</button>
        </div>

        {/* Reduced interest list */}
        <div className="tag-container">
          {interestCategories.slice(0, 3).flatMap((category) =>
            category.items.slice(0, 8).map((interest) => (
              <button
                key={interest}
                className={`tag ${interests.includes(interest) ? "selected" : ""}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))
          )}
        </div>

        {/* Show added custom interests */}
        {interests
          .filter(
            (interest) =>
              !interestCategories.some((cat) => cat.items.includes(interest))
          )
          .length > 0 && (
          <div className="custom-interests">
            <div className="tag-container">
              {interests
                .filter(
                  (interest) =>
                    !interestCategories.some((cat) => cat.items.includes(interest))
                )
                .map((interest) => (
                  <button
                    key={interest}
                    className="tag selected"
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
            </div>
          </div>
        )}

        <div className="buttons">
          <button className="back-btn" onClick={() => navigate("/onboarding/skills")}>
            Back
          </button>
          <button className="next-btn" onClick={() => navigate("/onboarding/projects")}>
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AddInterestsPage;
