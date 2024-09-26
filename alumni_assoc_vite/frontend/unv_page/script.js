import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import UniversityServicesDB from "../../firebase/services/firestore_db/UniversityServicesDB.js";
import UnvPostServices from "../../firebase/services/firestore_db/UnvPostServices.js";
import PostServicesDB from "../../firebase/services/firestore_db/PostServicesDB.js";

const authServices = new AuthServices();
const userServicesDB = new UserServicesDB();
const universityServicesDB = new UniversityServicesDB();
const unvPostServices = new UnvPostServices();
const postServicesDB = new PostServicesDB();

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

// Fetch and display university info
const fetchUniversityInfo = async () => {
  try {
    const university = await universityServicesDB.getUniversityById("101");
    document.getElementById("banner-image").src = university.banner_url;
    document.getElementById("qr-image").src = university.qr_url;
    populateUniversityDetails(university);
  } catch (error) {
    console.error("Error fetching university data:", error);
  }
};

const populateUniversityDetails = (university) => {
  const detailsContainer = document.getElementById("university-details");
  detailsContainer.innerHTML = ""; // Clear existing content

  const fields = [
    {
      label: "University Name",
      value: university.unv_name,
      icon: "fa-university",
    },
    {
      label: "Description",
      value: university.description,
      icon: "fa-info-circle",
    },
    { label: "Address", value: university.address, icon: "fa-map-marker-alt" },
    {
      label: "Contact Number",
      value: university.contact_num,
      icon: "fa-phone",
    },
    {
      label: "Public Email",
      value: university.public_mail,
      icon: "fa-envelope",
    },
    { label: "Website", value: university.website_url, icon: "fa-globe" },
  ];

  fields.forEach((field) => {
    if (field.value) {
      const fieldDiv = document.createElement("div");
      fieldDiv.className = "mt-4";
      fieldDiv.innerHTML = `
        <h3 class="text-xl font-semibold text-primary">
          <i class="fas ${field.icon} mr-2"></i>${field.label}
        </h3>
        <p class="mt-2 text-gray-600">${field.value}</p>
      `;
      detailsContainer.appendChild(fieldDiv);
    }
  });
};

fetchUniversityInfo();

const fetchAndDisplayUnvPosts = async () => {
  try {
    const unvPosts = await unvPostServices.getAllUnvPosts();
    
    const postsContainer = document.getElementById(
      "university-posts-container"
    );
    postsContainer.innerHTML = ""; // Clear existing content

    for (const unvPost of unvPosts) {
      const post = await postServicesDB.getPostById(unvPost.post_id);
      const postCard = document.createElement("div");
      postCard.className =
        "bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300";
      postCard.innerHTML = `
        <div class="relative">
          <img src="${
            unvPost.avatar_url
          }" alt="University Post Image" class="w-full h-48 object-fill">
        </div>
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">${
            unvPost.title
          }</h2>
          <p class="text-gray-700 mb-4">${unvPost.description}</p>
          <div class="flex items-center justify-between mt-4">
            <div class="flex items-center">
              <i class="fas fa-calendar-alt text-blue-500 mr-2"></i>
              <span class="text-sm text-gray-600">Posted on: <time datetime="${post.created_at
                .toDate()
                .toISOString()}">${post.created_at
        .toDate()
        .toLocaleDateString()}</time></span>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 flex justify-end">
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center">
            <i class="fas fa-info-circle mr-2"></i>
            More Info
          </button>
        </div>
      `;
      postsContainer.appendChild(postCard);
    }
  } catch (error) {
    console.error("Error fetching and displaying university posts:", error);
  }
};

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

// Hamburger menu functionality
document.getElementById("hamburger-menu").addEventListener("click", () => {
  const leftSidebar = document.getElementById("left-sidebar");
  leftSidebar.classList.toggle("hidden");
});

// Handle tab switching
document.querySelectorAll(".tab-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active class from all tabs
    document
      .querySelectorAll(".tab-content")
      .forEach((tab) => tab.classList.remove("active-tab"));

    // Add active class to the clicked tab's content
    const tabId = this.getAttribute("data-tab");
    document.getElementById(tabId).classList.add("active-tab");

    // Update tab link styles
    document
      .querySelectorAll(".tab-link")
      .forEach((tabLink) => tabLink.classList.remove("active"));
    this.classList.add("active");

    // Fetch and display university posts if the posts tab is clicked
    if (tabId === "posts-tab") {
      fetchAndDisplayUnvPosts();
    }
  });
});

// Modal functionality
const modal = document.getElementById("donation-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

document.querySelectorAll(".btn-donate").forEach((button) => {
  button.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
});
