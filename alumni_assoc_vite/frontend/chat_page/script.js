import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";

const authServices = new AuthServices();
const userServicesDB = new UserServicesDB();

// Sign out functionality
document.getElementById("sign-out-btn").addEventListener("click", async () => {
  try {
    await authServices.signOut();
    window.location.href = "../login_page/index.html";
  } catch (error) {
    console.error("Error signing out:", error);
  }
});

// Fetch and display current user info
authServices.getCurrentUser(async (user) => {
  if (user) {
    try {
      const userData = await userServicesDB.getUser(user.uid);
      document.querySelector(".profile-pic").src =
        userData.pf_pic_url || "default-profile-pic.jpg";
      document.querySelector(".full-name").textContent =
        userData.full_name || "Full Name";
      document.querySelector(".user-name").textContent =
        `@${userData.user_name}` || "@username";
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.log("No user is signed in.");
  }
});

// Debounce function to delay search execution
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Search functionality
const searchInput = document.querySelector(".search-input");
const resultsContainer = document.querySelector(".search-results");

const performSearch = async (searchTerm) => {
  // Clear previous results
  resultsContainer.innerHTML = "";

  if (searchTerm.length > 0) {
    resultsContainer.innerHTML = "<p class='text-white'>Searching...</p>";
    try {
      const users = await userServicesDB.getUsersByPartialUsername(searchTerm);
      resultsContainer.innerHTML = ""; // Clear the "Searching..." message
      if (users.length > 0) {
        users.forEach((user) => {
          const userComponent = document.createElement("div");
          userComponent.className =
            "user-component bg-white rounded-lg shadow-md p-2 flex items-center space-x-2 hover:bg-gray-50 transition duration-300 ease-in-out";
          userComponent.innerHTML = `
            <div class="flex-shrink-0">
              <img src="${
                user.pf_pic_url || "default-profile-pic.jpg"
              }" alt="Profile Picture" class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            </div>
            <div class="flex-grow overflow-hidden">
              <h3 class="text-sm font-semibold text-gray-800 truncate">${
                user.full_name || "Full Name"
              }</h3>
              <p class="text-xs text-gray-600 truncate">@${user.user_name}</p>
            </div>
          `;
          resultsContainer.appendChild(userComponent);
        });
      } else {
        resultsContainer.innerHTML = "<p class='text-white'>No user found.</p>";
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      resultsContainer.innerHTML =
        "<p class='text-white'>Error fetching users.</p>";
    }
  } else {
    // Clear the results container if the search term is empty
    resultsContainer.innerHTML = "";
  }
};

const debouncedSearch = debounce(performSearch, 300);

searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim();
  debouncedSearch(searchTerm);
});
