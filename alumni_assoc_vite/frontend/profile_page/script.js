import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import PostServicesDB from "../../firebase/services/firestore_db/PostServicesDB.js";

const authServices = new AuthServices();
const userServicesDB = new UserServicesDB();
const postServicesDB = new PostServicesDB();

// handle click on edit profile button
document.querySelector(".edit-profile-btn").addEventListener("click", () => {
  window.location.href = "../edit_profile_form/index.html";
});

// Sign out functionality
document.getElementById("sign-out-btn").addEventListener("click", async () => {
  try {
    await authServices.signOut();
    window.location.href = "../login_page/index.html";
  } catch (error) {
    console.error("Error signing out:", error);
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

// Hamburger menu functionality
document.getElementById("hamburger-menu").addEventListener("click", () => {
  const leftSidebar = document.getElementById("left-sidebar");
  leftSidebar.classList.toggle("hidden");
});

// Fetch and display current user info
let currentUserData = null;

authServices.getCurrentUser(async (user) => {
  if (user) {
    try {
      currentUserData = await userServicesDB.getUser(user.uid);

      // Update all elements with the class "profile-pic"
      document.querySelectorAll(".profile-pic").forEach((element) => {
        element.src = currentUserData.pf_pic_url || "default-profile-pic.jpg";
      });

      // Update all elements with the class "full-name"
      document.querySelectorAll(".full-name").forEach((element) => {
        element.textContent = currentUserData.full_name || "Full Name";
      });

      // Update all elements with the class "user-name"
      document.querySelectorAll(".user-name").forEach((element) => {
        element.textContent = `@${currentUserData.user_name}` || "@username";
      });

      // Update all elements with the class "user-type"
      document.querySelectorAll(".user-type").forEach((element) => {
        element.textContent = currentUserData.type || "Type";
      });

      // Show verified mark if user is verified
      if (currentUserData.is_verified) {
        document.querySelectorAll(".verified-mark").forEach((element) => {
          element.classList.remove("hidden");
        });
      }

      // Initially populate the "About" section
      populateAboutSection(currentUserData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.log("No user is signed in.");
  }
});

function populateAboutSection(userData) {
  const aboutContent = `
    <div class="space-y-6">
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-user mr-2"></i>Bio
        </span>
        <span class="text-gray-600 mt-4">${userData.bio || "N/A"}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-phone mr-2"></i>Contact Number
        </span>
        <span class="text-gray-600 mt-4">${userData.contact_num || "N/A"}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-map-marker-alt mr-2"></i>Current Location
        </span>
        <span class="text-gray-600 mt-4">${
          userData.current_location || "N/A"
        }</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-graduation-cap mr-2"></i>Domain
        </span>
        <span class="text-gray-600 mt-4">${userData.domain || "N/A"}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-envelope mr-2"></i>Email
        </span>
        <span class="text-gray-600 mt-4">${userData.email || "N/A"}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-id-card mr-2"></i>Enrollment Number
        </span>
        <span class="text-gray-600 mt-4">${
          userData.enrollment_num || "N/A"
        }</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-calendar-alt mr-2"></i>Graduation Year
        </span>
        <span class="text-gray-600 mt-4">${
          userData.graduation_year || "N/A"
        }</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-briefcase mr-2"></i>Workplace
        </span>
        <span class="text-gray-600 mt-4">${userData.workplace || "N/A"}</span>
      </div>
      <div class="flex flex-col">
        <span class="text-primary font-semibold text-xl flex items-center">
          <i class="fas fa-book mr-2"></i>Year of Study
        </span>
        <span class="text-gray-600 mt-4">${
          userData.year_of_study || "N/A"
        }</span>
      </div>
    </div>
  `;
  document.getElementById("tabContent").innerHTML = aboutContent;
}

// Tab functionality
const tabs = document.querySelectorAll("[data-tab]");
const tabContent = document.getElementById("tabContent");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove(
        "text-primary",
        "border-b-2",
        "border-primary",
        "font-medium",
        "text-xl"
      );
      t.classList.add("text-gray-600");
    });

    tab.classList.add(
      "text-primary",
      "border-b-2",
      "border-primary",
      "font-medium",
      "text-xl"
    );
    tab.classList.remove("text-gray-600");

    const tabName = tab.getAttribute("data-tab");
    if (tabName === "about") {
      populateAboutSection(currentUserData);
    } else {
      tabContent.innerHTML = `<p class="text-center text-gray-600">${tabName} content goes here.</p>`;
    }
  });
});
