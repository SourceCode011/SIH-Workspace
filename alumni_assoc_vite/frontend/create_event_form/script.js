const form = document.getElementById("eventCreationForm");
const modeOnline = document.getElementById("modeOnline");
const modeOffline = document.getElementById("modeOffline");
const platformField = document.getElementById("platformField");
const venueField = document.getElementById("venueField");
const eventImage = document.getElementById("eventImage");
const eventImageName = document.getElementById("eventImageName");
const dropZone = document.getElementById("dropZone");

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

// Prevent form submission (for demonstration)
form.addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Event created!");
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
