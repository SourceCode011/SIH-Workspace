import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UniversityServicesDB from "../../firebase/services/firestore_db/UniversityServicesDB.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";

const authServices = new AuthServices();
const universityServicesDB = new UniversityServicesDB();
const userServicesDB = new UserServicesDB();

// Fetch current user
authServices.getCurrentUser(async (user) => {
  if (user) {
    try {
      // Fetch user details
      const userDetails = await userServicesDB.getUser(user.uid);
      console.log(userDetails);

      // Populate sidebar with user details
      document.querySelector("h2").textContent =
        userDetails.full_name || "User name";
      document.querySelector("p.text-muted").textContent =
        userDetails.user_name || "@user_name";

      // Fetch university details
      const university = await universityServicesDB.getUniversityById("101");
      populateUniversityDetails(university);
    } catch (error) {
      console.error("Error fetching user or university details:", error);
    }
  } else {
    console.log("No user is signed in.");
  }
});

function populateUniversityDetails(university) {
  const mainContent = document.querySelector("main .p-6");
  mainContent.innerHTML = ""; // Clear existing content

  // Create and append banner
  if (university.banner_url) {
    const bannerDiv = document.createElement("div");
    bannerDiv.className = "bg-banner h-80 w-full mb-4 rounded-lg shadow-md"; // Increased height to h-80
    bannerDiv.style.backgroundImage = `url(${university.banner_url})`;
    bannerDiv.style.backgroundSize = "contain";
    bannerDiv.style.backgroundPosition = "center";
    mainContent.appendChild(bannerDiv);
  }

  // Create and append university details
  const detailsDiv = document.createElement("div");
  detailsDiv.className = "bg-white shadow-md p-6 rounded-lg";

  const fields = [
    { label: "University Name", value: university.unv_name },
    { label: "Description", value: university.description },
    { label: "Address", value: university.address },
    { label: "Contact Number", value: university.contact_num },
    { label: "Public Email", value: university.public_mail },
    { label: "Website", value: university.website_url },
  ];

  fields.forEach((field) => {
    if (field.value) {
      const fieldDiv = document.createElement("div");
      fieldDiv.className = "mt-4";
      fieldDiv.innerHTML = `<h3 class="text-xl font-semibold text-primary">${field.label}</h3><p class="mt-2 text-gray-600">${field.value}</p>`;
      detailsDiv.appendChild(fieldDiv);
    }
  });

  mainContent.appendChild(detailsDiv);
}

// Sign out functionality
document.getElementById("sign-out-btn").addEventListener("click", async () => {
  try {
    await authServices.signOut();
    window.location.href = "../login_page/index.html";
  } catch (error) {
    console.error("Error signing out:", error);
  }
});
