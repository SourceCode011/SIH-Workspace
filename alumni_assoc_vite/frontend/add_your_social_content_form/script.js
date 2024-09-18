// Image preview function
function previewImage(event) {
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');

    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.src = '';
        imagePreview.classList.add('hidden');
    }
}
