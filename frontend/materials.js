document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const linkInput = document.getElementById('linkInput');
    const materialsList = document.getElementById('materials');
    const uploadStatus = document.getElementById('uploadStatus');

    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        uploadStatus.textContent = 'Uploading...';

        // Upload the file to the server
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                uploadStatus.textContent = 'Upload successful!';
                // Display the uploaded file in the list
                addMaterialToList(`/uploads/${data.filename}`, data.filename);
            } else {
                uploadStatus.textContent = 'Upload failed. Please try again.';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            uploadStatus.textContent = 'Upload failed. Please try again.';
        });
    } else if (linkInput.value) {
        const linkUrl = linkInput.value;
        addMaterialToList(linkUrl, linkUrl);
        linkInput.value = ''; // Clear the input
    }

    // Clear file input
    fileInput.value = '';
});

// Function to add a material to the list
function addMaterialToList(url, name) {
    const materialsList = document.getElementById('materials');
    const materialItem = document.createElement('li');
    materialItem.className = 'material-item';

    // Determine the icon based on file type
    const icon = document.createElement('i');
    if (url.endsWith('.pdf')) {
        icon.className = 'fas fa-file-pdf';
    } else if (url.endsWith('.doc') || url.endsWith('.docx')) {
        icon.className = 'fas fa-file-word';
    } else if (url.endsWith('.ppt') || url.endsWith('.pptx')) {
        icon.className = 'fas fa-file-powerpoint';
    } else if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.gif')) {
        icon.className = 'fas fa-file-image';
    } else if (url.startsWith('http')) {
        icon.className = 'fas fa-link';
    } else {
        icon.className = 'fas fa-file';
    }

    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.textContent = name;

    materialItem.appendChild(icon);
    materialItem.appendChild(link);
    materialsList.appendChild(materialItem);
}
