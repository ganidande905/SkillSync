// src/features/auth/model/authModel.js

/**
 * Call login API
 * @param {string} url 
 * @param {Object} credentials 
 * @returns {Promise<Object>}
 */
export async function loginApi(url, credentials) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return await response.json();
  } catch (error) {
    console.error("Login API error:", error);
    return { success: false, message: "Network error" };
  }
}

/**
 * Call register API
 * @param {string} url 
 * @param {Object} data 
 * @returns {Promise<Object>}
 */
export async function registerApi(url, data) {
  try {
    console.log("🔸 Sending register request to:", url);
    console.log("🔸 With data:", data);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    console.log("Raw Register Response:", response.status, text);

    try {
      const json = JSON.parse(text);
      console.log(" Parsed JSON:", json);
      return json;
    } catch {
      console.error("Invalid JSON response from backend");
      return { success: false, message: "Invalid JSON response from server" };
    }
  } catch (error) {
    console.error(" Register API network error:", error);
    return { success: false, message: "Network error" };
  }
}
