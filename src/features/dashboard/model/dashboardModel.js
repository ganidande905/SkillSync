import { getOnboardingData } from "../../onboarding/model/onboardingModel";

export const getDashboardModel = () => {
  const onboarding = getOnboardingData();
  return {
    userName: "Ganeswara",
    activeTeams: 2,
    skillScore: 1420,
    globalRank: 23,
    progressRate: "+18%",
    skillDevelopment: 78,
    teamPerformance: 65,
    skills: onboarding.skills && onboarding.skills.length > 0 ? onboarding.skills : ["python", "java"],
    interests: onboarding.interests ?? [],
    projects: onboarding.projects ?? [],
  };
};
