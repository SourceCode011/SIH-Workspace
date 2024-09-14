// Function to toggle the dropdown menu
function toggleMenu() {
  var dropdown = document.getElementById('dropdown');
  if (dropdown.style.display === 'none' || dropdown.style.display === '') {
    dropdown.style.display = 'block';
  } else {
    dropdown.style.display = 'none';
  }
}
