const tabs = document.querySelectorAll(".tab-button");
const contentContainer = document.getElementById("content-container");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach((tab) => tab.classList.remove("active-tab"));

    // Add active class to the clicked tab
    tab.classList.add("active-tab");

    // Get the corresponding content based on the tab ID
    const contentId = tab.id.replace("-tab", "-content");
    const content = document.getElementById(contentId);

    // Hide all content sections
    contentContainer
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.add("hidden"));

    // Show the selected content section
    content.classList.remove("hidden");
  });
});

// Initially show the "details" tab content
document.getElementById("details-content").classList.remove("hidden");
