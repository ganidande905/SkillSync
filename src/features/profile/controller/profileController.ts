import { getProfileSummary } from "../model/profileService";

export async function loadProfile(
  userId: number,
  userName: string,
  userEmail: string
) {
  return getProfileSummary(userId, userName, userEmail);
}