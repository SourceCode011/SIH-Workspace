import UniversityServicesDB from "../../firebase/services/firestore_db/UniversityServicesDB.js";
import StorageServices from "../../firebase/services/storage/StorageServices.js";

const universityService = new UniversityServicesDB();
const storageServices = new StorageServices();

async function fetchAndPopulateUniversityData() {
  try {
    const universityId = "101";
    const university = await universityService.getUniversityById(universityId);

    // Populate form fields with existing university data
    document.getElementById("name").value = university.unv_name || "";
    document.getElementById("description").value = university.description || "";
    document.getElementById("location").value = university.address || "";
    document.getElementById("contact").value = university.contact_num || "";
    document.getElementById("website").value = university.website_url || "";
    document.getElementById("email").value = university.public_mail || "";

    // Handle form submission
    const form = document.getElementById("jobOpeningForm");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get updated values from the form
      const updatedName = document.getElementById("name").value.trim();
      const updatedDescription = document
        .getElementById("description")
        .value.trim();
      const updatedLocation = document.getElementById("location").value.trim();
      const updatedContact = document.getElementById("contact").value.trim();
      const updatedWebsite = document.getElementById("website").value.trim();
      const updatedEmail = document.getElementById("email").value.trim();
      const bannerImage = document.getElementById("bannerImage").files[0];

      let bannerUrl = university.banner_url;

      // Upload banner image if available
      if (bannerImage) {
        const bannerPath = `/university/unv_banner/${universityId}`;
        try {
          bannerUrl = await storageServices.uploadFile(bannerImage, bannerPath);
        } catch (error) {
          console.error("Failed to upload banner image", error);
          alert("Failed to upload banner image.");
          return;
        }
      }

      // Create an updated university object with only the provided fields
      const updatedUniversity = {
        ...university,
        unv_name: updatedName || university.unv_name,
        description: updatedDescription || university.description,
        address: updatedLocation || university.address,
        contact_num: updatedContact || university.contact_num,
        website_url: updatedWebsite || university.website_url,
        public_mail: updatedEmail || university.public_mail,
        banner_url: bannerUrl,
      };

      try {
        await universityService.updateUniversity(updatedUniversity);
        alert("University details updated successfully.");
        window.history.back();
      } catch (error) {
        console.error("Error updating university details:", error);
        alert("Failed to update university details. Please try again.");
      }
    });
  } catch (error) {
    console.error("Error fetching university data:", error);
  }
}

// Call the function to fetch and populate university data
fetchAndPopulateUniversityData();
