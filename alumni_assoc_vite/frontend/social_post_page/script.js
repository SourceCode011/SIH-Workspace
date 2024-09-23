import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import PostServicesDB from "../../firebase/services/firestore_db/PostServicesDB.js";
import SocialPostServicesDB from "../../firebase/services/firestore_db/SocialPostServicesDB.js";

const authServices = new AuthServices();
const userServicesDB = new UserServicesDB();
const postServicesDB = new PostServicesDB();
const socialPostServicesDB = new SocialPostServicesDB();

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

// Fetch and display social posts
const socialPostsContainer = document.getElementById("social-posts-container");

const fetchAndDisplaySocialPosts = async () => {
  try {
    const socialPosts = await socialPostServicesDB.getAllSocialPosts();
    for (const socialPost of socialPosts) {
      const user = await userServicesDB.getUser(socialPost.user_id);
      const post = await postServicesDB.getPostById(socialPost.post_id);

      const postElement = document.createElement("div");
      postElement.className = "bg-white rounded-lg shadow-md overflow-hidden";

      postElement.innerHTML = `
        <!-- User Info -->
        <div class="p-4 flex items-center space-x-4">
          <img src="${
            user.pf_pic_url || "https://via.placeholder.com/40"
          }" alt="User Avatar" class="w-10 h-10 rounded-full">
          <div>
            <h3 class="font-semibold text-gray-800">${user.full_name}</h3>
            <p class="text-sm text-gray-600">Posted ${new Date(
              post.created_at.seconds * 1000
            ).toLocaleString()}</p>
          </div>
        </div>
        
        <!-- Post Image -->
        <img src="${socialPost.image_url}" alt="${
        socialPost.image_url
      }" class="w-full h-64 object-cover">
        
        <!-- Post Caption -->
        <div class="p-4">
          <p class="text-gray-800">${socialPost.caption}</p>
        </div>
        
        <!-- Post Actions -->
        <div class="px-4 pb-4 flex justify-between items-center border-t border-gray-200 pt-3">
          <div class="flex space-x-4">
            <button class="flex items-center space-x-2 text-gray-600">
              <i class="far fa-heart"></i>
              <span>Like</span>
            </button>
            <button class="flex items-center space-x-2 text-gray-600">
              <i class="far fa-comment"></i>
              <span>Comment</span>
            </button>
          </div>
          <button class="text-gray-600">
            <i class="far fa-share-square"></i>
          </button>
        </div>
      `;

      socialPostsContainer.appendChild(postElement);
    }
  } catch (error) {
    console.error("Error fetching social posts:", error);
  }
};

fetchAndDisplaySocialPosts();

// Hamburger menu functionality
document.getElementById("hamburger-menu").addEventListener("click", () => {
  const leftSidebar = document.getElementById("left-sidebar");
  leftSidebar.classList.toggle("hidden");
});
