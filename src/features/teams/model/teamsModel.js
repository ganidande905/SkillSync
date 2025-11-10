// src/features/teams/model/teamsModel.js

export const getTeamsModel = () => ({
  teamMatch: {
    name: "GreenTech Solutions",
    desc: "Sustainable energy management app",
    about: "Creating smart solutions for renewable energy management in residential and commercial buildings.",
    skillsNeeded: ["React", "Mobile Dev", "UI/UX"],
    match: "87%",
    members: [
      { initials: "DK", name: "David Kim", role: "IoT Engineer", skills: ["Arduino", "Sensors"] },
      { initials: "LP", name: "Lisa Park", role: "Data Scientist", skills: ["Python", "Analytics"] }
    ],
  },
  matches: [
    { name: "AI Innovation Hub", desc: "Building an AI-powered healthcare platform" }
  ]
});
