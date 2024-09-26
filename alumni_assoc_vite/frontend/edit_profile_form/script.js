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
    try {
      const userData = await userService.getUser(currentUser.uid);

      // Populate form fields with existing user data
      document.getElementById("fullName").placeholder =
        userData.full_name || "";
      document.getElementById("enrollmentNum").placeholder =
        userData.enrollment_num || "";
      document.getElementById("contactNum").placeholder =
        userData.contact_num || "";
      document.getElementById("currentLocation").placeholder =
        userData.current_location || "";
      document.getElementById("domain").placeholder = userData.domain || "";
      document.getElementById("bio").placeholder = userData.bio || "";
      document.getElementById("workplace").placeholder =
        userData.workplace || "";
      document.getElementById("yearOfStudy").value =
        userData.year_of_study || "";
      document.getElementById("graduationYear").value =
        userData.graduation_year || "";

      const form = document.getElementById("additionalDetailsForm");
      const typeRadioButtons = document.querySelectorAll('input[name="type"]');
      const yearOfStudyGroup = document.getElementById("yearOfStudyGroup");
      const graduationYearGroup = document.getElementById(
        "graduationYearGroup"
      );
      const workplaceGroup = document.getElementById("workplaceGroup");
      const profilePicInput = document.getElementById("profilePic");
      const idProofInput = document.getElementById("idProof");

      let type = userData.type;
      let profilePicFile = null;
      let idProofFile = null;

      // Set the initial visibility of fields based on user type
      if (type === "student") {
        yearOfStudyGroup.style.display = "block";
        graduationYearGroup.style.display = "none";
        workplaceGroup.style.display = "none";
      } else if (type === "alumni") {
        yearOfStudyGroup.style.display = "none";
        graduationYearGroup.style.display = "block";
        workplaceGroup.style.display = "block";
      }

      typeRadioButtons.forEach((radio) => {
        if (radio.value === type) {
          radio.checked = true;
          radio.nextElementSibling.classList.add("radio-selected");
          radio.nextElementSibling.classList.remove("radio-default");
        }
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

        const fullName =
          document.getElementById("fullName").value.trim() ||
          userData.full_name;
        const enrollmentNum =
          document.getElementById("enrollmentNum").value.trim() ||
          userData.enrollment_num;
        const contactNum =
          document.getElementById("contactNum").value.trim() ||
          userData.contact_num;
        const currentLocation =
          document.getElementById("currentLocation").value.trim() ||
          userData.current_location;
        const domain =
          document.getElementById("domain").value.trim() || userData.domain;
        const bio = document.getElementById("bio").value.trim() || userData.bio;
        const workplace =
          document.getElementById("workplace").value.trim() ||
          userData.workplace;
        const yearOfStudy =
          document.getElementById("yearOfStudy").value ||
          userData.year_of_study;
        const graduationYear =
          document.getElementById("graduationYear").value ||
          userData.graduation_year;

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
            : userData.pf_pic_url;
          const idProofUrl = idProofFile
            ? await storageServices.uploadFile(
                idProofFile,
                `/id_proofs/${currentUser.uid}`
              )
            : userData.id_proof_url;

          // Update user in Firestore
          const updatedUser = {
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
            is_verified: userData.is_verified,
            pf_pic_url: profilePicUrl || null,
            posts: userData.posts,
            type: type || null,
            workplace: type === "alumni" ? workplace : null,
            year_of_study: type === "student" ? yearOfStudy : null,
          };

          await userService.updateUser(currentUser.uid, updatedUser);
          alert("User details updated successfully.");
          window.history.back();
        } catch (error) {
          console.error("Error updating user details:", error);
          alert("Failed to update user details. Please try again.");
        }
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  } else {
    console.error("No user is signed in.");
  }
});
