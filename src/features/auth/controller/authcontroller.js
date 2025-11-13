import { loginApi, registerApi } from "../model/authModel.js";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function loginUser(credentials) {
  try {
    if (!credentials.email || !credentials.password) {
      return { success: false, message: "Email and password are required" };
    }

    const res = await loginApi(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    if (res.id || res.name) {
      if (res.token) {
        localStorage.setItem("authToken", res.token);
      }

      if (res.id) {
        localStorage.setItem("userId", String(res.id));
      }
      if (res.email) {
        localStorage.setItem("userEmail", res.email);
      }
      if (res.name) {
        localStorage.setItem("userName", res.name);
      }

      return {
        success: true,
        message: "Login successful!",
        userId: res.id,
      };
    }

    return { success: false, message: res.detail || "Invalid credentials" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

export async function registerUser(data) {
  try {
    if (!data.email || !data.name || !data.password || !data.university) {
      return { success: false, message: "All fields are required" };
    }

    const res = await registerApi(`${BASE_URL}/auth/register`, {
      email: data.email,
      name: data.name,
      password: data.password,
      university: data.university,
    });

    if (res.id) {
      localStorage.setItem("userId", String(res.id));
      localStorage.setItem("userEmail", res.email || data.email);
      localStorage.setItem("userName", res.name || data.name);

      return {
        success: true,
        message: "Registration successful!",
        userId: res.id,
      };
    }

    return { success: false, message: res.detail || "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "An error occurred during registration",
    };
  }
}

/**
 * @param {string} query
 * @returns {Promise<string[]>}
 */
export async function fetchUniversitySuggestions(query) {
  if (!query || query.length < 2) return [];

  try {
    const res = await fetch(
      `http://universities.hipolabs.com/search?country=India&name=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    const names = data
      .filter((u) => u.country === "India")
      .map((u) => u.name);

    return names.slice(0, 5);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return [];
  }
}

export function getCurrentUserId() {
  const id = localStorage.getItem("userId");
  return id ? parseInt(id, 10) : null;
}