import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import UserNameServicesDB from "../../firebase/services/firestore_db/UserNameServicesDB.js";

const authService = new AuthServices();
const userServicesDB = new UserServicesDB();
const userNameServicesDB = new UserNameServicesDB();

document.getElementById("regForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!isValidUsername(username)) {
    alert("Invalid username");
    return;
  }
  if (!isValidEmail(email)) {
    alert("Invalid email format");
    return;
  }
  if (!isValidPassword(password)) {
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

    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Error during sign-up process:", error);
    alert("Sign-up failed: " + error.message);
  }
});

function isValidUsername(username) {
  return username.length >= 3;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}
