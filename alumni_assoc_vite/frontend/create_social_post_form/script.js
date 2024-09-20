function previewImage(event) {
    const imagePreview = document.getElementById('image-preview');
    const imagePreviewName = document.getElementById('image-preview-name');

    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
            imagePreviewName.textContent = file.name;
        }
        reader.readAsDataURL(file);
    }
}
