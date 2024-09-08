function validateLogin() {
    var loginEnrollmentNo = document.getElementById('loginEmailId').value;
    var loginPassword = document.getElementById('loginPassword').value;

    if (loginEnrollmentNo && loginPassword) {
        alert('Login successful!');
        
    } else {
        alert('Invalid login. Please try again.');
    }
}


function registerUser() {
    var regEmailId = document.getElementById('regEmailId').value;
    var regPassword = document.getElementById('regPassword').value;

    if (regEmailId && regPassword) {
        alert('Registration successful! Now you can log in.');
        showLogin();
    } else {
        alert('Invalid registration. Please fill in all fields.');
    }
}

