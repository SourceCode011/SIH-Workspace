import AuthServices from "../../firebase/services/auth/AuthServices.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import ValidationUtils from "../../utils/validation_utils.js";
import StorageServices from "../../firebase/services/storage/StorageServices.js";

const authService = new AuthServices();
const userService = new UserServicesDB();

// radio button styling on selection
const radioButtons = document.querySelectorAll('input[name="type"]');
radioButtons.forEach((radio) => {
  radio.addEventListener("click", function () {
    radioButtons.forEach((r) => {
      const label = r.nextElementSibling;
      if (r.checked) {
        label.classList.add("radio-selected");
        label.classList.remove("radio-default");
      } else {
        label.classList.add("radio-default");
        label.classList.remove("radio-selected");
      }
    });
  });
});

authService.getCurrentUser(async (currentUser) => {
  if (currentUser) {
    const form = document.getElementById("additionalDetailsForm");
    const typeRadioButtons = document.querySelectorAll('input[name="type"]');
    const yearOfStudyGroup = document.getElementById("yearOfStudyGroup");
    const graduationYearGroup = document.getElementById("graduationYearGroup");
    const workplaceGroup = document.getElementById("workplaceGroup");
    const profilePicInput = document.getElementById("profilePic");
    const idProofInput = document.getElementById("idProof");
    const submitButton = document.querySelector('button[type="submit"]');

    let type = null;
    let profilePicFile = null;
    let idProofFile = null;

    typeRadioButtons.forEach((radio) => {
      radio.addEventListener("click", function () {
        type = this.value;
        if (type === "student") {
          yearOfStudyGroup.style.display = "block";
          graduationYearGroup.style.display = "none";
          workplaceGroup.style.display = "none";
        } else if (type === "alumni") {
          yearOfStudyGroup.style.display = "none";
          graduationYearGroup.style.display = "block";
          workplaceGroup.style.display = "block";
        }
      });
    });

    profilePicInput.addEventListener("change", function () {
      profilePicFile = this.files[0];
      document.getElementById("profilePicName").textContent =
        profilePicFile.name;
    });

    idProofInput.addEventListener("change", function () {
      idProofFile = this.files[0];
      document.getElementById("idProofName").textContent = idProofFile.name;
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!type) {
        alert("Please select a type (student or alumni).");
        return;
      }

      if (!idProofFile) {
        alert("Please upload an ID proof.");
        return;
      }

      const fullName = document.getElementById("fullName").value.trim();
      const enrollmentNum = document
        .getElementById("enrollmentNum")
        .value.trim();
      const contactNum = document.getElementById("contactNum").value.trim();
      const currentLocation = document
        .getElementById("currentLocation")
        .value.trim();
      const domain = document.getElementById("domain").value.trim();
      const bio = document.getElementById("bio").value.trim();
      const workplace = document.getElementById("workplace").value.trim();
      const yearOfStudy = document.getElementById("yearOfStudy").value;
      const graduationYear = document.getElementById("graduationYear").value;

      // Validate inputs
      if (!ValidationUtils.isValidFullName(fullName)) {
        alert("Please enter a valid full name.");
        return;
      }
      if (!ValidationUtils.isValidEnrollmentNum(enrollmentNum)) {
        alert("Please enter a valid enrollment number.");
        return;
      }
      if (!ValidationUtils.isValidContactNum(contactNum)) {
        alert("Please enter a valid contact number.");
        return;
      }
      if (!ValidationUtils.isValidDomain(domain)) {
        alert("Please enter a valid domain.");
        return;
      }
      if (!ValidationUtils.isValidBio(bio)) {
        alert("Please enter a valid bio.");
        return;
      }
      if (type === "alumni") {
        if (!ValidationUtils.isValidWorkplace(workplace)) {
          alert("Please enter a valid workplace.");
          return;
        }
        if (!ValidationUtils.isValidGraduationYear(graduationYear)) {
          alert("Please select a valid graduation year.");
          return;
        }
      }
      if (type === "student") {
        if (!ValidationUtils.isValidYearOfStudy(yearOfStudy)) {
          alert("Please select a valid year of study.");
          return;
        }
      }

      try {
        // Upload files to Firebase Storage
        const storageServices = new StorageServices();
        const profilePicUrl = profilePicFile
          ? await storageServices.uploadFile(
              profilePicFile,
              `/profile_pics/${currentUser.uid}`
            )
          : null;
        const idProofUrl = await storageServices.uploadFile(
          idProofFile,
          `/id_proofs/${currentUser.uid}`
        );

        // Update user in Firestore
        const user = {
          user_id: currentUser.uid,
          user_name: currentUser.displayName || null,
          email: currentUser.email,
          bio: bio || null,
          contact_num: contactNum || null,
          current_location: currentLocation || null,
          domain: domain || null,
          enrollment_num: enrollmentNum || null,
          full_name: fullName || null,
          graduation_year: type === "alumni" ? graduationYear : null,
          id_proof_url: idProofUrl || null,
          is_complete: true,
          is_verified: false,
          pf_pic_url: profilePicUrl || null,
          posts: [],
          type: type || null,
          workplace: type === "alumni" ? workplace : null,
          year_of_study: type === "student" ? yearOfStudy : null,
        };

        await userService.updateUser(currentUser.uid, user);
        alert("User details updated successfully.");
        window.href = "../social_post_page/index.html";
      } catch (error) {
        console.error("Error updating user details:", error);
        alert("Failed to update user details. Please try again.");
      }
    });
  } else {
    console.error("No user is signed in.");
  }
});
