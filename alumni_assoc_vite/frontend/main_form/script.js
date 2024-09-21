// JavaScript for Sidebar and Plus Menu Toggle

// Function to toggle the sidebar
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    // If sidebar is active (visible), hide it, otherwise show it
    if (sidebar.classList.contains("active")) {
        sidebar.classList.remove("active");
    } else {
        sidebar.classList.add("active");
    }
}

// Function to toggle the Plus button menu
function togglePlusMenu() {
    const plusMenu = document.getElementById("plusMenu");
    // If plus menu is active (visible), hide it, otherwise show it
    if (plusMenu.classList.contains("active")) {
        plusMenu.classList.remove("active");
    } else {
        plusMenu.classList.add("active");
    }
}

// Close the sidebar when clicking outside of it
window.onclick = function(event) {
    const sidebar = document.getElementById("sidebar");
    const plusMenu = document.getElementById("plusMenu");
    
    // If the click is outside of sidebar or plus menu and the sidebar is open, close it
    if (!event.target.matches('.menu-icon') && !event.target.closest('#sidebar')) {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    }

    // If the click is outside of plus menu and the plus menu is open, close it
    if (!event.target.matches('.plus-button') && !event.target.closest('#plusMenu')) {
        if (plusMenu.classList.contains('active')) {
            plusMenu.classList.remove('active');
        }
    }
}
