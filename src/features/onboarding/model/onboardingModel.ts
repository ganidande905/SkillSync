export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface SelectedSkill {
  name: string;
  level: SkillLevel;
}

export interface PastProject {
  title: string;
  description: string;
  technologies: string;
}

export interface OnboardingData {
  skills: SelectedSkill[];
  interests: string[];
  projects: string[];
}

export const onboardingData: OnboardingData = {
  skills: [],
  interests: [],
  projects: [],
};


export const saveOnboardingData = (data: OnboardingData) => {
  localStorage.setItem("onboardingData", JSON.stringify(data));
};

// Retrieve onboarding data
export const getOnboardingData = (): OnboardingData => {
  const stored = localStorage.getItem("onboardingData");
  return stored ? JSON.parse(stored) : onboardingData;
};

export const skillCategories = [
  {
    type: "Programming Languages",
    items: [
      "Python",
      "C",
      "C++",
      "Java",
      "JavaScript",
      "TypeScript",
      "Go",
      "Rust",
      "Kotlin",
      "Swift",
    ],
  },
  {
    type: "Web Development",
    items: [
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Bootstrap",
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "Vue.js",
      "Angular",
      "REST API Development",
      "Full Stack Development",
    ],
  },
  {
    type: "Backend Frameworks",
    items: ["Django", "FastAPI", "Flask", "Spring Boot", "Laravel"],
  },
  {
    type: "Mobile Development",
    items: ["Flutter", "React Native", "Android Studio", "iOS Development"],
  },
  {
    type: "Databases",
    items: ["MySQL", "PostgreSQL", "MongoDB", "SQLite", "Firebase", "Redis"],
  },
  {
    type: "Data Science & Machine Learning",
    items: [
      "Machine Learning",
      "Deep Learning",
      "Data Analysis",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "TensorFlow",
      "PyTorch",
      "Computer Vision",
      "Natural Language Processing (NLP)",
    ],
  },
  {
    type: "Cloud & DevOps",
    items: [
      "AWS",
      "Google Cloud Platform (GCP)",
      "Microsoft Azure",
      "Docker",
      "Kubernetes",
      "Git",
      "GitHub",
      "CI/CD",
      "Linux System Administration",
    ],
  },
  {
    type: "Cybersecurity & Networking",
    items: [
      "Network Security",
      "Ethical Hacking",
      "Penetration Testing",
      "Cryptography",
      "Cloud Security",
      "Network Management",
    ],
  },
  {
    type: "Software Engineering & Tools",
    items: [
      "Agile Methodology",
      "Scrum",
      "Software Testing",
      "Debugging",
      "System Design",
      "UI/UX Design",
      "Figma",
      "Adobe XD",
    ],
  },
  {
    type: "Artificial Intelligence",
    items: [
      "Artificial Intelligence",
      "Reinforcement Learning",
      "Recommendation Systems",
      "Chatbot Development",
    ],
  },
  {
    type: "Hardware & Embedded Systems",
    items: [
      "Internet of Things (IoT)",
      "Embedded C",
      "Arduino Programming",
      "Raspberry Pi",
      "Microcontrollers",
    ],
  },
  {
    type: "Soft Skills",
    items: [
      "Communication Skills",
      "Leadership",
      "Time Management",
      "Analytical Thinking",
      "Teamwork",
      "Project Management",
      "Problem Solving",
      "Adaptability",
    ],
  },
];

export const interestCategories = [
  {
    type: "Artificial Intelligence & Data Science",
    items: [
      "Artificial Intelligence",
      "Machine Learning",
      "Deep Learning",
      "Data Science",
      "Data Visualization",
      "Predictive Analytics",
      "Computer Vision",
      "Natural Language Processing (NLP)",
    ],
  },
  {
    type: "Software & Web Development",
    items: [
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Web Applications",
      "Progressive Web Apps (PWAs)",
      "UI/UX Design",
      "Software Architecture",
    ],
  },
  {
    type: "Mobile Development",
    items: [
      "Android App Development",
      "iOS App Development",
      "Cross-Platform Apps",
      "Flutter Projects",
      "React Native Projects",
    ],
  },
  {
    type: "Cybersecurity & Networks",
    items: [
      "Ethical Hacking",
      "Network Security",
      "Data Privacy",
      "Cryptography",
      "Cyber Forensics",
    ],
  },
  {
    type: "Cloud & DevOps",
    items: [
      "Cloud Infrastructure (AWS/GCP/Azure)",
      "DevOps Automation",
      "Kubernetes Management",
      "Continuous Deployment",
      "CI/CD Pipelines",
    ],
  },
  {
    type: "Emerging Technologies",
    items: [
      "Blockchain",
      "Internet of Things (IoT)",
      "Augmented Reality (AR)",
      "Virtual Reality (VR)",
      "Quantum Computing",
    ],
  },
  {
    type: "Domain-Based Interests",
    items: [
      "Healthcare Technology",
      "Finance & FinTech",
      "Education Technology",
      "Agriculture Automation",
      "E-Commerce Systems",
      "Smart Cities",
      "Sustainable Technology",
    ],
  },
  {
    type: "Research & Academic",
    items: [
      "AI Research Papers",
      "Data Science Competitions",
      "Open Source Contributions",
      "Hackathons",
      "Academic Writing",
      "Project-Based Learning",
    ],
  },
  {
    type: "Career Development",
    items: [
      "Internships",
      "Placements Preparation",
      "Competitive Programming",
      "Problem Solving Challenges",
      "Public Speaking",
      "Entrepreneurship",
    ],
  },
];