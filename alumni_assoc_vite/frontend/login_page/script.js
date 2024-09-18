import AuthServices from "../../firebase/services/auth/AuthServices.js";

const authService = new AuthServices();

async function validateLogin(event) {
  event.preventDefault(); 

  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  if (loginEmail && loginPassword) {
    try {
      await authService.signIn(loginEmail, loginPassword);
      alert("Login successful!");
      window.location.href = "../../index.html"; //later on path may be changed based on req now its set for testing only
    } catch (error) {
      alert("Invalid login. Please try again.");
      console.error("Login failed:", error);
    }
  } else {
    alert("Please enter both email and password.");
  }
}


document.getElementById("loginForm").addEventListener("submit", validateLogin);
