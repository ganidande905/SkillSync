import { loginApi, registerApi } from "../model/authModel";

const BASE_URL = "https://skillapi.ganidande.com";

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ success: boolean, message?: string, token?: string }>}
 */
export async function loginUser(credentials) {
  try {
    // Input validation
    if (!credentials.email || !credentials.password) {
      return { success: false, message: "Email and password are required" };
    }
    if (!credentials.email.includes("@")) {
      return { success: false, message: "Please enter a valid email" };
    }
    if (credentials.password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }

    // Call login API
    const res = await loginApi(`${BASE_URL}/auth/login`, credentials);

    if (res.success) {
      // Store auth token
      if (res.token) localStorage.setItem("authToken", res.token);
      return res;
    }

    return { success: false, message: res.message || "Invalid credentials" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

/**
 * Register new user
 * @param {Object} data - { fullName, email, password }
 * @returns {Promise<{ success: boolean, message?: string, userId?: number }>}
 */
export async function registerUser(data) {
  try {
    // Input validation
    if (!data.fullName || !data.email || !data.password) {
      return { success: false, message: "All fields are required" };
    }
    if (!data.email.includes("@")) {
      return { success: false, message: "Please enter a valid email" };
    }
    if (data.password.length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }
    if (data.fullName.length < 2) {
      return { success: false, message: "Please enter a valid name" };
    }

    // Call register API
    const res = await registerApi(`${BASE_URL}/auth/register`, data);

    if (res.success) {
      return res;
    }

    return { success: false, message: res.message || "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
}
