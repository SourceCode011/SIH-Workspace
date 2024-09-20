import AuthServices from "../../firebase/services/auth/AuthServices.js";
import StorageServices from "../../firebase/services/storage/StorageServices.js";
import EventServicesDB from "../../firebase/services/firestore_db/EventServicesDB.js";
import PostServicesDB from "../../firebase/services/firestore_db/PostServicesDB.js";
import UserServicesDB from "../../firebase/services/firestore_db/UserServicesDB.js";
import ValidationUtils from "../../utils/validation_utils.js";

const form = document.getElementById("eventCreationForm");
const modeOnline = document.getElementById("modeOnline");
const modeOffline = document.getElementById("modeOffline");
const platformField = document.getElementById("platformField");
const venueField = document.getElementById("venueField");
const eventImage = document.getElementById("eventImage");
const eventImageName = document.getElementById("eventImageName");
const dropZone = document.getElementById("dropZone");

const authService = new AuthServices();

authService.getCurrentUser(async (currentUser) => {
  if (!currentUser) {
    console.error("No user is signed in.");
    return;
  }

  function toggleFields() {
    if (modeOnline.checked) {
      platformField.style.display = "block";
      venueField.style.display = "none";
    } else {
      platformField.style.display = "none";
      venueField.style.display = "block";
    }
  }

  modeOnline.addEventListener("change", toggleFields);
  modeOffline.addEventListener("change", toggleFields);

  // Initial toggle
  toggleFields();

  // File upload handling
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

  // Radio button styling on selection
  const radioButtons = document.querySelectorAll('input[name="mode"]');
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

  // Prevent form submission (for demonstration)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    handleSubmit();
  });

  async function handleSubmit() {
    const titleValue = document.getElementById("title").value.trim();
    const descriptionValue = document
      .getElementById("description")
      .value.trim();
    const modeValue = document.querySelector(
      'input[name="mode"]:checked'
    ).value;
    const platformValue = document.getElementById("platform").value.trim();
    const venueValue = document.getElementById("venue").value.trim();

    if (!ValidationUtils.isValidTitle(titleValue)) {
      alert("Invalid title.");
      return;
    }
    if (!ValidationUtils.isValidDescription(descriptionValue)) {
      alert("Invalid description.");
      return;
    }
    
    if (!ValidationUtils.isValidMode(modeValue)) {
      alert("Invalid mode.");
      return;
    }
    if (
      modeValue === "online" &&
      !ValidationUtils.isValidPlatform(platformValue)
    ) {
      alert("Invalid platform.");
      return;
    }
    if (modeValue === "offline" && !ValidationUtils.isValidVenue(venueValue)) {
      alert("Invalid venue.");
      return;
    }

    const postServicesDB = new PostServicesDB();
    const eventServicesDB = new EventServicesDB();
    const userServicesDB = new UserServicesDB();
    const storageServices = new StorageServices();

    const postId = postServicesDB.generateUniquePostId();
    const eventId = eventServicesDB.generateUniqueEventId();
    const avatarPath = `/posts/event_avatars/${eventId}`;

    let avatarUrl = null;

    // Upload avatar if available
    if (eventImage.files.length > 0) {
      try {
        await storageServices.uploadFile(eventImage.files[0], avatarPath);
        avatarUrl = await storageServices.getDownloadUrl(avatarPath);
      } catch (error) {
        console.error("Failed to upload avatar", error);
        alert("Failed to upload avatar.");
        return;
      }
    }

    // Create post object
    const post = {
      post_id: postId,
      type: "event",
      user_id: currentUser.uid,
      created_at: new Date().toISOString(),
    };

    try {
      // Add post to Firestore
      await postServicesDB.addPost(post);

      // Create event object
      const event = {
        avatar_url: avatarUrl,
        description: descriptionValue,
        event_id: eventId,
        mode: modeValue,
        platform: platformValue,
        post_id: postId,
        title: titleValue,
        venue: venueValue,
        user_id: currentUser.uid,
      };

      // Add event to Firestore
      await eventServicesDB.addEvent(event);

      // Fetch current user
      const user = await userServicesDB.getUser(currentUser.uid);
      if (user) {
        // Add new post ID to user's posts
        const userPosts = user.posts || [];
        userPosts.push(postId);
        user.posts = userPosts;

        // Update user in Firestore
        await userServicesDB.updateUser(currentUser.uid, user);
        alert("Event created successfully.");
      } else {
        console.error("User not found.");
        alert("User not found.");
      }
    } catch (error) {
      console.error("Error creating event", error);
      alert("Error creating event.");
    }
  }
});
