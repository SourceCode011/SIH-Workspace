function validateLogin() {
    var loginEnrollmentNo = document.getElementById('loginEnrollmentNo').value;
    var loginPassword = document.getElementById('loginPassword').value;

    if (loginEnrollmentNo && loginPassword) {
        alert('Login successful!');
        
    } else {
        alert('Invalid login. Please try again.');
    }
}


function registerUser() {
    var regEnrollmentNo = document.getElementById('regEnrollmentNo').value;
    var regPassword = document.getElementById('regPassword').value;

    if (regEnrollmentNo && regPassword) {
        alert('Registration successful! Now you can log in.');
        showLogin();
    } else {
        alert('Invalid registration. Please fill in all fields.');
    }
}





document.addEventListener('DOMContentLoaded', function() {
  
    const profileUpload = document.getElementById('profile-upload');
    const profileFilename = document.getElementById('profile-filename');
    const profileDelete = document.getElementById('profile-delete');
    
    const idUpload = document.getElementById('id-upload');
    const idFilename = document.getElementById('id-filename');
    const idDelete = document.getElementById('id-delete');
  
    // Handle Profile Picture Upload
    profileUpload.addEventListener('change', function() {
      if (profileUpload.files.length > 0) {
        profileFilename.textContent = profileUpload.files[0].name;
        profileDelete.style.display = 'inline';
      }
    });
  
    profileDelete.addEventListener('click', function() {
      profileUpload.value = ''; // Clear the input file
      profileFilename.textContent = 'No file selected';
      profileDelete.style.display = 'none';
    });
  
    // Handle ID Proof Upload
    idUpload.addEventListener('change', function() {
      if (idUpload.files.length > 0) {
        idFilename.textContent = idUpload.files[0].name;
        idDelete.style.display = 'inline';
      }
    });
  
    idDelete.addEventListener('click', function() {
      idUpload.value = ''; // Clear the input file
      idFilename.textContent = 'No file selected';
      idDelete.style.display = 'none';
    });
  
  
  });
  






