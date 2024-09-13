// JavaScript for toggling the hamburger menu
document.getElementById('menu').addEventListener('click', function () {
    const menuItems = document.getElementById('menu-items');
    menuItems.classList.toggle('menu-active');
  });
  
  // Optional: Add functionality to the post button or other interactions
  document.getElementById('post-btn').addEventListener('click', function () {
    alert('Create a new post');
  });
  