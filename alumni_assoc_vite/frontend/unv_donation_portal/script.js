document.getElementById('donationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const amount = document.getElementById('amount').value;
    const donationType = document.getElementById('donationType').value;

    // Basic form validation
    if (fullName === '' || email === '' || amount === '' || donationType === '') {
        alert('Please fill in all fields.');
        return;
    }

    // Display a confirmation message
    alert(`Thank you, ${fullName}, for your generous donation of $${amount} towards ${donationType}. A confirmation has been sent to ${email}.`);

    // Optionally clear the form after submission
    this.reset();
});
