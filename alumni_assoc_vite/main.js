import AuthServices from "./firebase/services/auth/AuthServices.js";

document.addEventListener("DOMContentLoaded", () => {
  const authService = new AuthServices();
  const currentUser = authService.getCurrentUser();
  const appDiv = document.getElementById("app");

  if (currentUser) {
    const userId = currentUser.uid;
    appDiv.innerText = `Current User ID: ${userId}`;
  } else {
    appDiv.innerText = `not authenticated`;
  }
});
