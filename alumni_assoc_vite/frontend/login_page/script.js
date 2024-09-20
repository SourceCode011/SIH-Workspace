import AuthServices from "../../firebase/services/auth/AuthServices.js";
import ValidationUtils from "../../utils/validation_utils.js";

const authService = new AuthServices();

async function validateLogin(event) {
  event.preventDefault();

  const loginEmail = document.getElementById("loginEmail").value.trim();
  const loginPassword = document.getElementById("loginPassword").value.trim();

  // Validate input using ValidationUtils
  if (!ValidationUtils.isValidEmail(loginEmail)) {
    alert("Invalid email format");
    return;
  }
  if (!ValidationUtils.isValidPassword(loginPassword)) {
    alert("Password too weak, must be 6 characters or more.");
    return;
  }

  try {
    await authService.signIn(loginEmail, loginPassword);
    alert("Login successful!");
    window.location.href = "../../index.html"; //later on path may be changed based on req now its set for testing only
  } catch (error) {
    alert("Invalid login. Please try again.");
    console.error("Login failed:", error);
  }
}

document.getElementById("loginForm").addEventListener("submit", validateLogin);
