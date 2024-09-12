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






