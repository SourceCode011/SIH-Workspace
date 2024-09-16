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
  



// registration 1
function validateForm() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const passwordError = document.getElementById('passwordError');

    // Clear previous error message
    passwordError.style.display = 'none';

    if (password !== confirmPassword) {
        passwordError.textContent = "Passwords do not match!";
        passwordError.style.display = 'block';

        // Highlight the confirm password field in red
        document.getElementById('confirmPassword').style.borderBottom = '2px solid red';
        return false; // Prevent form submission
    } else {
        document.getElementById('confirmPassword').style.borderBottom = '2px solid #fff';
    }

    return true; // Allow form submission
}

// registration 2

function toggleFields() {
    const registrationType = document.getElementById('registrationType').value;
    const studentFields = document.getElementById('studentFields');
    const alumniFields = document.getElementById('alumniFields');

    if (registrationType === 'student') {
        studentFields.style.display = 'block';
        alumniFields.style.display = 'none';
    } else if (registrationType === 'alumni') {
        studentFields.style.display = 'none';
        alumniFields.style.display = 'block';
    } else {
        studentFields.style.display = 'none';
        alumniFields.style.display = 'none';
    }
}

function previewProfilePicture() {
    const file = document.getElementById('profilePicture').files[0];
    const preview = document.getElementById('profilePictureImg');
    const defaultImage = 'default-profile.png';

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        }
        reader.readAsDataURL(file);
    } else {
        preview.src = defaultImage;
    }
}


document.getElementById('selectProfilePhotoBtn').addEventListener('click', function () {
    document.getElementById('profilePicInput').click();
});

document.getElementById('profilePicInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePicPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
