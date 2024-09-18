// Display selected file name
const fileInput = document.getElementById('file-upload');
const fileNameDisplay = document.getElementById('file-name');

fileInput.addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
    fileNameDisplay.textContent = fileName;
});
