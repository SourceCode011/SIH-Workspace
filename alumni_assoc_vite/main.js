import AuthServices from "./firebase/services/auth/AuthServices.js";

document.addEventListener('DOMContentLoaded', () => {
  const authService = new AuthServices();
  
  authService.getCurrentUser((currentUser) => {
    if (currentUser) {
      const userId = currentUser.uid;
      const appDiv = document.getElementById('app');
      appDiv.innerHTML = `Current User ID: ${userId}`;
    } else {
      console.log('No user is signed in.');
    }
  });
});
