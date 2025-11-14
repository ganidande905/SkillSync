import type { DashboardData } from "../model/dashboardModel";
import { getDashboardSummary } from "../model/dashboardService";


export async function getDashboardData(
  userId: number,
  userName: string
): Promise<DashboardData> {
  if (!userId) {
    throw new Error("User ID is required for dashboard data");
  }

  return getDashboardSummary(userId, userName);
}

