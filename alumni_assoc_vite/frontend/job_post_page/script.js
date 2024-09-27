import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import JobServicesDB from "../../firebase/services/firestore_db/JobServicesDB.js";

const authServices = new AuthServices();
const userServicesDB = new UserServicesDB();
const jobServicesDB = new JobServicesDB();

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

// Fetch and display job posts
const jobPostsContainer = document.getElementById("job-posts-container");

const fetchAndDisplayJobPosts = async () => {
  try {
    const jobPosts = await jobServicesDB.getAllJobs();
    for (const job of jobPosts) {
      const jobElement = document.createElement("div");
      jobElement.className =
        "job-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300";

      jobElement.innerHTML = `
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">${
                job.job_title
              }</h2>
              <p class="text-lg text-gray-600 mb-2">${job.domain}</p>
            </div>
            <span class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">${
              job.work_mode
            }</span>
          </div>

          <p class="text-gray-700 mb-4">${job.description}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            ${job.req_skills
              .split(",")
              .map(
                (skill) =>
                  `<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">${skill.trim()}</span>`
              )
              .join("")}
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="flex items-center">
              <i class="fas fa-map-marker-alt text-gray-500 mr-2"></i>
              <span class="text-gray-700">${job.job_location}</span>
            </div>
            <div class="flex items-center">
              <i class="fas fa-rupee-sign text-gray-500 mr-2"></i>
              <span class="text-gray-700">${(job.salary / 100000).toFixed(
                2
              )} LPA</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <div class="flex items-center mb-2">
              <i class="fas fa-envelope text-gray-500 mr-2"></i>
              <a href="mailto:${
                job.contact_email
              }" class="text-blue-600 hover:underline">${job.contact_email}</a>
            </div>
            <div class="flex items-center">
              <i class="fas fa-phone text-gray-500 mr-2"></i>
              <a href="tel:${
                job.contact_num
              }" class="text-blue-600 hover:underline">${job.contact_num}</a>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 px-6 py-4">
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 w-full">
            Apply Now
          </button>
        </div>
      `;

      jobPostsContainer.appendChild(jobElement);
    }
  } catch (error) {
    console.error("Error fetching job posts:", error);
  }
};

fetchAndDisplayJobPosts();

// Hamburger menu functionality
document.getElementById("hamburger-menu").addEventListener("click", () => {
  const leftSidebar = document.getElementById("left-sidebar");
  leftSidebar.classList.toggle("hidden");
});
