import ApplicationServicesDB from "../../firebase/services/firestore_db/ApplicationServicesDB.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import AuthServices from "../../firebase/services/auth/AuthServices.js";

const applicationServicesDB = new ApplicationServicesDB();
const userServicesDB = new UserServicesDB();
const authServices = new AuthServices();

async function fetchAndDisplayApplications() {
  try {
    const applications = await applicationServicesDB.getAllApplications();
    const container = document.getElementById("applications-container");

    for (const application of applications) {
      const user = await userServicesDB.getUser(application.user_id);
      const card = createApplicationCard(application, user);
      container.appendChild(card);
    }

    feather.replace();
  } catch (error) {
    console.error("Error fetching applications or user details:", error);
  }
}

function createApplicationCard(application, user) {
  const card = document.createElement("div");
  card.className = "bg-white rounded-lg shadow-lg overflow-hidden mb-6";

  card.innerHTML = `
        <div class="relative h-56 bg-gray-200 cursor-pointer">
            <img src="${application.id_proof_url}" alt="ID Proof" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute bottom-0 right-0 m-4 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                ${application.application_id}
            </div>
        </div>
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">${user.full_name}</h2>
                    <p class="text-sm text-gray-600">@${user.user_name}</p>
                </div>
                <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">${user.type}</span>
            </div>
            <div class="mb-4">
                <p class="text-sm text-gray-700"><span class="font-medium">Enrollment:</span> ${application.enrollment_no}</p>
            </div>
            <div class="flex justify-between space-x-4">
                <button class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center reject-btn" data-application-id="${application.application_id}">
                    <i data-feather="x" class="w-4 h-4 mr-2"></i> Reject
                </button>
                <button class="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center accept-btn" data-application-id="${application.application_id}" data-user-id="${user.user_id}">
                    <i data-feather="check" class="w-4 h-4 mr-2"></i> Approve
                </button>
            </div>
        </div>
    `;

  card.querySelector(".reject-btn").addEventListener("click", async () => {
    await handleApplicationDecision(application.application_id, false);
  });

  card.querySelector(".accept-btn").addEventListener("click", async () => {
    await handleApplicationDecision(application.application_id, true, user);
  });

  card.querySelector(".relative").addEventListener("click", () => {
    showModal(application.id_proof_url);
  });

  return card;
}

async function handleApplicationDecision(
  applicationId,
  isAccepted,
  user = null
) {
  try {
    if (isAccepted && user) {
      // Update the user's is_verified attribute to true
      user.is_verified = true;
      await userServicesDB.updateUser(user.user_id, user);
    }

    // Delete the application from the database
    await applicationServicesDB.deleteApplicationById(applicationId);

    // Refresh the page
    window.location.reload();
  } catch (error) {
    console.error("Error handling application decision:", error);
  }
}

function showModal(imageUrl) {
  const modal = document.getElementById("image-modal");
  const modalImage = document.getElementById("modal-image");
  modalImage.src = imageUrl;
  modal.classList.add("active");
}

document.getElementById("close-modal").addEventListener("click", () => {
  const modal = document.getElementById("image-modal");
  modal.classList.remove("active");
});

fetchAndDisplayApplications();
