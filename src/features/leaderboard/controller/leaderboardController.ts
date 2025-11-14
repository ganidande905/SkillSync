import { apiGet } from "../../../api/client";

export type LeaderboardUser = {
  id: number;
  name: string;
  email: string;
  score: number;
};


export async function getLeaderboardData(): Promise<LeaderboardUser[]> {
  return apiGet<LeaderboardUser[]>("/leaderboard/");
}