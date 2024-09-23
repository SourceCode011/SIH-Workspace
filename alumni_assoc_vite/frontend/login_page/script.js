import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import ValidationUtils from "../../utils/validation_utils.js";

const authService = new AuthServices();
const userService = new UserServicesDB();

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
    authService.getCurrentUser(async (currentUser) => {
      if (currentUser) {
        const user = await userService.getUser(currentUser.uid);
        if (user && !user.is_complete) {
          window.location.href = "../user_details_form/index.html"; // Navigate to additional details form
        } else {
          window.location.href = "../social_post_page/index.html"; // Navigate to main page
        }
      } else {
        alert("Sign-in successful, but unable to fetch user details.");
      }
    });
  } catch (error) {
    alert("Invalid login. Please try again.");
    console.error("Login failed:", error);
  }
}

document.getElementById("loginForm").addEventListener("submit", validateLogin);
