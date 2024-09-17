function validateLogin() {
    var loginEnrollmentNo = document.getElementById('loginEnrollmentNo').value;
    var loginPassword = document.getElementById('loginPassword').value;

    if (loginEnrollmentNo && loginPassword) {
        alert('Login successful!');
        
    } else {
        alert('Invalid login. Please try again.');
    }
}


