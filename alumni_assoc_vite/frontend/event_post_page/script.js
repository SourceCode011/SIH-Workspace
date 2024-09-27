import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import EventServicesDB from "../../firebase/services/firestore_db/EventServicesDB.js";

const authServices = new AuthServices();
const userServicesDB = new UserServicesDB();
const eventServicesDB = new EventServicesDB();

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
              <div class="flex items-center space-x-1">
                <h3 class="text-sm font-semibold text-gray-800 truncate">${
                  user.full_name || "Full Name"
                }</h3>
                ${
                  user.is_verified
                    ? `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>`
                    : ""
                }
              </div>
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

// Fetch and display events
const eventsContainer = document.getElementById("events-container");

const fetchAndDisplayEvents = async () => {
  try {
    const events = await eventServicesDB.getAllEvents();
    for (const event of events) {
      const eventElement = document.createElement("div");
      const user = await userServicesDB.getUser(event.user_id);
      eventElement.className =
        "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300";

      eventElement.innerHTML = `
                <div class="p-4 bg-gray-50 flex items-center space-x-4">
                    <img src="${
                      user.pf_pic_url
                    }" alt="User Profile" class="w-10 h-10 rounded-full">
                    <div>
                        <h3 class="font-semibold text-gray-800">${
                          user.full_name || "Full Name"
                        }</h3>
                        <p class="text-sm text-gray-600">${
                          user.user_name || "@username"
                        }</p>
                    </div>
                </div>
                <img src="${event.avatar_url}" alt="${
        event.title
      }" class="w-full h-48 object-cover">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-4">
                        <h2 class="text-2xl font-bold text-gray-800">${
                          event.title
                        }</h2>
                        <span class="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">${
                          event.mode
                        }</span>
                    </div>
                    <p class="event-description text-gray-700 mb-6">${
                      event.description
                    }</p>
                    <div class="grid grid-cols-2 gap-4 mb-4">
                        <div class="flex items-center">
                            <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
                            <span class="text-gray-700">${event.venue}</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-laptop text-gray-500 mr-2"></i>
                            <span class="text-gray-700">${event.platform}</span>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        <i class="fas fa-calendar-alt mr-2"></i>
                        <span>Date and Time TBA</span>
                    </div>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300">
                        Register
                    </button>
                </div>
            `;

      eventsContainer.appendChild(eventElement);
    }
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};

fetchAndDisplayEvents();

// Hamburger menu functionality
document.getElementById("hamburger-menu").addEventListener("click", () => {
  const leftSidebar = document.getElementById("left-sidebar");
  leftSidebar.classList.toggle("hidden");
});
