import AuthServices from "../../firebase/services/auth/AuthServices.js";
import PostServicesDB from "../../firebase/services/firestore_db/PostServicesDB.js";
import UniversityServicesDB from "../../firebase/services/firestore_db/UniversityServicesDB.js";
import StorageServices from "../../firebase/services/storage/StorageServices.js";
import ValidationUtils from "../../utils/validation_utils.js";

const eventImage = document.getElementById("image-upload");
const eventImageName = document.getElementById("image-preview-name");
const dropZone = document.getElementById("dropZone");
const descriptionInput = document.getElementById("caption");
const titleInput = document.getElementById("title");
const submitButton = document.querySelector("button[type='submit']");

const authService = new AuthServices();
const postServicesDB = new PostServicesDB();
const universityServicesDB = new UniversityServicesDB();
const storageServices = new StorageServices();

authService.getCurrentUser(async (currentUser) => {
  if (!currentUser) {
    console.error("No user is signed in.");
    return;
  }

  function handleFiles(files) {
    if (files.length > 0) {
      eventImage.files = files;
      eventImageName.textContent = files[0].name;
    } else {
      eventImageName.textContent = "No file chosen";
    }
  }

  // Click to upload
  dropZone.addEventListener("click", function (e) {
    eventImage.click();
  });

  eventImage.addEventListener("change", function (e) {
    handleFiles(this.files);
  });

  // Drag and drop functionality
  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.add("border-blue-500");
  });

  dropZone.addEventListener("dragleave", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove("border-blue-500");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    this.classList.remove("border-blue-500");
    handleFiles(e.dataTransfer.files);
  });

  submitButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const descriptionValue = descriptionInput.value.trim();
    const titleValue = titleInput.value.trim();

    if (!ValidationUtils.isValidTitle(titleValue)) {
      alert("Invalid title.");
      return;
    }

    if (!ValidationUtils.isValidDescription(descriptionValue)) {
      alert("Invalid description.");
      return;
    }

    if (eventImage.files.length === 0) {
      alert("Image is required.");
      return;
    }

    const postId = postServicesDB.generateUniquePostId();
    const imgPath = `/university/unv_posts/${postId}`;

    let imgUrl = null;

    try {
      imgUrl = await storageServices.uploadFile(eventImage.files[0], imgPath);
    } catch (error) {
      console.error("Failed to upload image", error);
      alert("Failed to upload image.");
      return;
    }

    const post = {
      post_id: postId,
      post_type: "unv_post",
      user_id: currentUser.uid,
      created_at: new Date(),
    };

    try {
      await postServicesDB.addPost(post);

      const unvPost = {
        post_id: postId,
        unv_id: "101",
        title: titleValue,
        description: descriptionValue,
        avatar_url: imgUrl,
      };

      await universityServicesDB.addUniversityPost(unvPost);

      alert("University post created successfully.");
      window.history.back();
    } catch (error) {
      console.error("Error creating university post", error);
      alert("Error creating university post.");
    }
  });
});
