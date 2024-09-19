// Example of handling form submission or other actions
document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from submitting to server
    alert("Job posted successfully!");
});
