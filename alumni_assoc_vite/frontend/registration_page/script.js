import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import UserNameServicesDB from "../../firebase/services/firestore_db/UserNameServicesDB.js";
import ValidationUtils from "../../utils/validation_utils.js";

const authService = new AuthServices();
const userServicesDB = new UserServicesDB();
const userNameServicesDB = new UserNameServicesDB();

document.getElementById("regForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Validate input using ValidationUtils
  if (!ValidationUtils.isValidUsername(username)) {
    alert("Invalid username");
    return;
  }
  if (!ValidationUtils.isValidEmail(email)) {
    alert("Invalid email format");
    return;
  }
  if (!ValidationUtils.isValidPassword(password)) {
    alert("Password too weak, must be 6 characters or more.");
    return;
  }

  try {
    const usernameExists = await userNameServicesDB.doesUsernameExist(username);
    if (usernameExists) {
      alert("Username already in use. Please choose a different one.");
      return;
    }

    const userCredential = await authService.signUp(email, password);
    const userId = userCredential.user.uid;

    await userServicesDB.addUser(userId, username, email);
    await userNameServicesDB.addUsername(username);

    alert("Sign-up successful");

    // Navigate to additional details form
    window.location.href = "../user_details_form/index.html";
  } catch (error) {
    console.error("Error during sign-up process:", error);
    alert("Sign-up failed: " + error.message);
  }
});

