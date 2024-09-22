import AuthServices from "../../firebase/services/auth/AuthServices.js";
import PostServicesDB from "../../firebase/services/firestore_db/PostServicesDB.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import JobServicesDB from "../../firebase/services/firestore_db/JobServicesDB.js";
import ValidationUtils from "../../utils/validation_utils.js";

const jobTitleInput = document.getElementById("title");
const jobLocationInput = document.getElementById("location");
const jobDescriptionInput = document.getElementById("description");
const jobDomainInput = document.getElementById("domain");
const jobRequiredSkillInput = document.getElementById("skills");
const jobSalaryInput = document.getElementById("salary");
const jobModeSelect = document.getElementById("job-mode");
const jobContactEmailInput = document.getElementById("email");
const jobContactPhoneNoInput = document.getElementById("phone");
const submitButton = document.querySelector("button[type='submit']");

const authService = new AuthServices();

authService.getCurrentUser(async (currentUser) => {
  if (!currentUser) {
    console.error("No user is signed in.");
    return;
  }

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const title = jobTitleInput.value.trim();
    const location = jobLocationInput.value.trim();
    const description = jobDescriptionInput.value.trim();
    const domain = jobDomainInput.value.trim();
    const requiredSkills = jobRequiredSkillInput.value.trim();
    const salary = jobSalaryInput.value.trim();
    const mode = jobModeSelect.value.trim();
    const contactEmail = jobContactEmailInput.value.trim();
    const contactPhoneNo = jobContactPhoneNoInput.value.trim();

    if (!ValidationUtils.isValidTitle(title)) {
      alert("Invalid Title");
      return;
    }
    if (!ValidationUtils.isValidLocation(location)) {
      alert("Please enter the job location.");
      return;
    }
    if (!ValidationUtils.isValidDescription(description)) {
      alert("Invalid Description");
      return;
    }
    if (!ValidationUtils.isValidDomain(domain)) {
      alert("Please enter the job domain.");
      return;
    }
    if (!ValidationUtils.isValidRequiredSkill(requiredSkills)) {
      alert("Please enter required skills");
      return;
    }
    if (!ValidationUtils.isValidSalary(salary)) {
      alert("Please enter a valid salary");
      return;
    }
    if (!ValidationUtils.isValidJobMode(mode)) {
      alert("Please enter a valid job mode");
      return;
    }
    if (!ValidationUtils.isValidEmail(contactEmail)) {
      alert("Please enter a valid contact email");
      return;
    }
    if (!ValidationUtils.isValidContactNum(contactPhoneNo)) {
      alert("Please enter a valid contact phone number");
      return;
    }

    const postServicesDB = new PostServicesDB();
    const jobServicesDB = new JobServicesDB();
    const userServicesDB = new UserServicesDB();
    const postId = postServicesDB.generateUniquePostId();
    const jobId = jobServicesDB.generateUniqueJobId();

    const post = {
      post_id: postId,
      type: "jobs",
      user_id: currentUser.uid,
      created_at: new Date().toISOString(),
    };

    try {
      await postServicesDB.addPost(post);

      const jobPost = {
        contact_email: contactEmail,
        contact_phone_no: contactPhoneNo,
        description: description,
        domain: domain,
        job_id: jobId,
        location: location,
        title: title,
        post_id: postId,
        required_skills: requiredSkills,
        salary: salary,
        user_id: currentUser.uid,
        mode: mode,
      };

      await jobServicesDB.addJob(jobPost);

      const user = await userServicesDB.getUser(currentUser.uid);
      if (user) {
        const userPosts = user.posts || [];
        userPosts.push(postId);
        user.posts = userPosts;

        await userServicesDB.updateUser(currentUser.uid, user);

        alert("Job posted successfully.");
      } else {
        console.error("User not found.");
        alert("User not found.");
      }
    } catch (error) {
      console.error("Error creating job post", error);
      alert("Error creating job post.");
    }
  });
});
