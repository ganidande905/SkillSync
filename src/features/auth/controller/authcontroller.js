// src/features/auth/controller/authController.js

import { loginApi, registerApi } from "../model/authModel.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

/**
 * LOGIN USER
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ success: boolean, message?: string, token?: string }>}
 */
export async function loginUser(credentials) {
  try {
    if (!credentials.email || !credentials.password) {
      return { success: false, message: "Email and password are required" };
    }

    console.log("🔹 Login URL:", `${BASE_URL}/auth/login`);
    console.log("🔹 Sending data:", credentials);

    const res = await loginApi(`${BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });

    console.log("🔹 Login API Response:", res);

    if (res.id || res.name) {
      if (res.token) localStorage.setItem("authToken", res.token);
      return { success: true, message: "Login successful!" };
    }

    if (res.detail) {
      return { success: false, message: res.detail };
    }

    return { success: false, message: "Invalid credentials" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

/**
 
 * REGISTER USER
 * @param {Object} data - { email, name, password }
 * @returns {Promise<{ success: boolean, message?: string, userId?: number }>}
 */
export async function registerUser(data) {
  try {
    if (!data.email || !data.name || !data.password) {
      return { success: false, message: "All fields are required" };
    }

    console.log("🔹 Register URL:", `${BASE_URL}/auth/register`);
    console.log("🔹 Sending data:", data);

    const res = await registerApi(`${BASE_URL}/auth/register`, {
      email: data.email,
      name: data.name,
      password: data.password,
    });

    console.log("🔹 Register API Response:", res);

    if (res.id) {
      return { success: true, message: "Registration successful!" };
    }

    if (res.detail) {
      return { success: false, message: res.detail };
    }

    return { success: false, message: "Registration failed" };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "An error occurred during registration" };
  }
}
