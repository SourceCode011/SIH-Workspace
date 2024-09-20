import AuthServices from "../../firebase/services/auth/AuthServices.js";
import StorageServices from "../../firebase/services/storage/StorageServices.js";
import PostServicesDB from "../../firebase/services/firestore_db/PostServicesDB.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import SocialPostServicesDB from "../../firebase/services/firestore_db/SocialPostServicesDB.js";
import ValidationUtils from "../../utils/validation_utils.js";

const eventImage = document.getElementById("image-upload");
const eventImageName = document.getElementById("image-preview-name");
const dropZone = document.getElementById("dropZone");
const captionInput = document.getElementById("caption");
const submitButton = document.querySelector("button[type='submit']");

const authService = new AuthServices();

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

    const captionValue = captionInput.value.trim();

    if (!ValidationUtils.isValidCaption(captionValue)) {
      alert("Invalid caption.");
      return;
    }

    const postServicesDB = new PostServicesDB();
    const socialPostServicesDB = new SocialPostServicesDB();
    const userServicesDB = new UserServicesDB();
    const storageServices = new StorageServices();

    const postId = postServicesDB.generateUniquePostId();
    const socialPostId = socialPostServicesDB.generateUniqueSocialPostId();
    const imgPath = `/posts/socials/${socialPostId}`;

    let imgUrl = null;

    if (eventImage.files.length > 0) {
      try {
        await storageServices.uploadFile(eventImage.files[0], imgPath);
        imgUrl = await storageServices.getDownloadUrl(imgPath);
      } catch (error) {
        console.error("Failed to upload image", error);
        alert("Failed to upload image.");
        return;
      }
    }

    const post = {
      post_id: postId,
      type: "social",
      user_id: currentUser.uid,
      created_at: new Date().toISOString(),
    };

    try {
      await postServicesDB.addPost(post);

      const socialPost = {
        caption: captionValue,
        img_url: imgUrl,
        post_id: postId,
        social_post_id: socialPostId,
        user_id: currentUser.uid,
      };

      await socialPostServicesDB.addSocialPost(socialPost);

      const user = await userServicesDB.getUser(currentUser.uid);
      if (user) {
        const userPosts = user.posts || [];
        userPosts.push(postId);
        user.posts = userPosts;

        await userServicesDB.updateUser(currentUser.uid, user);

        alert("Social post created successfully.");
      } else {
        console.error("User not found.");
        alert("User not found.");
      }
    } catch (error) {
      console.error("Error creating social post", error);
      alert("Error creating social post.");
    }
  });
});
