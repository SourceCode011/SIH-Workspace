// Function to show a modal
function showModal(modal) {
    modal.classList.remove('hidden');
}

// Function to hide a modal
function hideModal(modal) {
    modal.classList.add('hidden');
}

// Handle banner image upload and preview
document.getElementById('banner-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('banner-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Banner deletion confirmation
document.getElementById('delete-banner-icon').addEventListener('click', function() {
    showModal(document.getElementById('delete-banner-modal'));
});

document.getElementById('confirm-delete-banner').addEventListener('click', function() {
    document.getElementById('banner-image').src = 'https://static.vecteezy.com/system/resources/previews/002/534/006/original/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg';
    document.getElementById('banner-upload').value = "";  // Reset the input
    hideModal(document.getElementById('delete-banner-modal'));
});

document.getElementById('cancel-delete-banner').addEventListener('click', function() {
    hideModal(document.getElementById('delete-banner-modal'));
});

// Toggle edit banner section visibility
document.getElementById('edit-banner-icon').addEventListener('click', function() {
    document.getElementById('edit-banner-section').classList.remove('hidden');
});

document.getElementById('close-edit-section').addEventListener('click', function() {
    document.getElementById('edit-banner-section').classList.add('hidden');
});

// Handle profile picture upload and preview
document.getElementById('profile-pic-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profile-pic').src = e.target.result;
            document.getElementById('profile-pic-edit').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Profile picture deletion confirmation
document.getElementById('remove-icon').addEventListener('click', function() {
    showModal(document.getElementById('delete-confirm-modal'));
});

document.getElementById('confirm-delete').addEventListener('click', function() {
    const defaultPicUrl = 'https://static.vecteezy.com/system/resources/previews/002/534/006/original/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg';
    document.getElementById('profile-pic').src = defaultPicUrl;
    document.getElementById('profile-pic-edit').src = defaultPicUrl;
    document.getElementById('profile-pic-upload').value = "";  // Reset the input
    hideModal(document.getElementById('delete-confirm-modal'));
});

document.getElementById('cancel-delete').addEventListener('click', function() {
    hideModal(document.getElementById('delete-confirm-modal'));
});

// Toggle edit profile picture section visibility
document.getElementById('edit-profile-pic-icon').addEventListener('click', function() {
    document.getElementById('edit-profile-pic-section').classList.remove('hidden');
});

document.getElementById('close-edit-profile-pic-section').addEventListener('click', function() {
    document.getElementById('edit-profile-pic-section').classList.add('hidden');
});

// Note: The following section is commented out as it references a nonexistent navbar
/*
document.querySelector('nav a:nth-child(1)').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor click behavior
    document.getElementById('user').classList.add('hidden'); // Hide the profile section
    document.getElementById('posts-section').classList.remove('hidden'); // Show the posts section
});
*/

document.addEventListener('DOMContentLoaded', function () {
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const aboutSection = document.getElementById('about-section');
    const aboutTextarea = document.getElementById('about-textarea');

    editProfileBtn.addEventListener('click', () => {
        if (aboutTextarea.classList.contains('hidden')) {
            aboutTextarea.classList.remove('hidden');
            aboutTextarea.value = aboutSection.textContent.trim();
            aboutSection.classList.add('hidden');
            aboutTextarea.disabled = false;
            aboutTextarea.focus();
            editProfileBtn.textContent = "Save";
        } else {
            aboutSection.textContent = aboutTextarea.value.trim() || "Tell something about you";
            aboutTextarea.classList.add('hidden');
            aboutSection.classList.remove('hidden');
            aboutTextarea.disabled = true;
            editProfileBtn.textContent = "Edit Your Profile";
        }
    });
});



// Function to handle tab switching
function openTab(event, sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach((section) => {
        section.classList.add('hidden');
    });

    // Remove active class from all navbar links
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('text-blue-500', 'border-blue-500', 'font-bold');
    });

    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');

    // Add active class to the clicked tab
    event.target.classList.add('text-blue-500', 'border-blue-500', 'font-bold');
}


// Array to store posts
let posts = [];

// Function to add a new post
function addPost() {
    const postContent = document.getElementById('postContent').value.trim();

    if (postContent) {
        // Create a post object
        const newPost = {
            id: posts.length + 1,
            content: postContent,
            likes: 0,
            comments: []
        };

        // Add the new post to the posts array
        posts.unshift(newPost);

        // Clear the input field
        document.getElementById('postContent').value = '';

        // Display the updated posts
        displayPosts();
    }
}

// Function to display posts
function displayPosts() {
    const postsDisplay = document.getElementById('postsDisplay');
    postsDisplay.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'p-4 border border-gray-300 rounded-md';

        postElement.innerHTML = `
            <p class="text-gray-800">${post.content}</p>
            <div class="flex items-center space-x-4 mt-2">
                <button onclick="likePost(${post.id})" class="text-blue-500 hover:underline">Like (${post.likes})</button>
                <button onclick="toggleCommentSection(${post.id})" class="text-blue-500 hover:underline">Comment (${post.comments.length})</button>
            </div>
            <div id="comments-${post.id}" class="hidden mt-2">
                <textarea id="commentInput-${post.id}" class="w-full p-1 border border-gray-300 rounded-md resize-none" rows="1" placeholder="Write a comment..."></textarea>
                <button onclick="addComment(${post.id})" class="mt-1 px-2 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Comment</button>
                <div id="commentsList-${post.id}" class="mt-2 space-y-2">
                    <!-- Comments will be displayed here -->
                </div>
            </div>
        `;

        postsDisplay.appendChild(postElement);
    });
}

// Function to like a post
function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.likes += 1;
        displayPosts();
    }
}

// Function to toggle the comment section
function toggleCommentSection(postId) {
    const commentSection = document.getElementById(`comments-${postId}`);
    if (commentSection) {
        commentSection.classList.toggle('hidden');
    }
}

// Function to add a comment to a post
function addComment(postId) {
    const commentInput = document.getElementById(`commentInput-${postId}`).value.trim();

    if (commentInput) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push(commentInput);
            document.getElementById(`commentInput-${postId}`).value = '';
            displayPosts();
        }
    }
}



// Add event listener for the submit button
document.getElementById('submit-post').addEventListener('click', function () {
    const content = document.getElementById('postContent').value;
    const fileInput = document.getElementById('post-upload');
    const file = fileInput.files[0];

    if (content || file) {
        const postContainer = document.createElement('div');
        postContainer.classList.add('border', 'p-4', 'rounded', 'mb-4', 'bg-gray-100');

        // Add content
        const postText = document.createElement('p');
        postText.textContent = content;
        postContainer.appendChild(postText);

        // Add uploaded file preview
        // if (file) {
        //     const fileReader = new FileReader();
        //     fileReader.onload = function (e) {
        //         const filePreview = document.createElement('img');
        //         filePreview.src = e.target.result;
        //         filePreview.classList.add('w-full', 'h-auto', 'mt-2', 'rounded');
        //         postContainer.appendChild(filePreview);
        //     };
        //     fileReader.readAsDataURL(file);
        // }

        if (file) {
            const fileReader = new FileReader();
            fileReader.onload = function(e) {
                const filePreview = document.createElement('img');
                filePreview.src = e.target.result;
        
                // Set a specific aspect ratio using Tailwind classes
                filePreview.classList.add('w-full', 'h-48', 'object-cover', 'rounded', 'mt-2'); // h-48 sets a fixed height
        
                postContainer.appendChild(filePreview);
            };
            fileReader.readAsDataURL(file);
        }

        // Append the new post to the post feed
        document.getElementById('postsDisplay').prepend(postContainer);

        // Reset the input fields
        document.getElementById('postContent').value = '';
        fileInput.value = ''; // Reset the file input
    } else {
        alert("Please enter some content or upload a file.");
    }

    



});



// JavaScript for handling the account type selection
document.getElementById('editAccountTypeIcon').addEventListener('click', function (event) {
    const dropdown = document.getElementById('accountTypeDropdown');
    dropdown.classList.toggle('hidden');
    event.stopPropagation();
});

// Function to select an account type
function selectAccountType(type) {
    const accountTypeInput = document.getElementById('accountType');
    accountTypeInput.value = type; // Set the selected value

    // Update the course prefix based on the selected account type
    const coursePrefixInput = document.getElementById('coursePrefixInput');
    if (type === 'a Student') {
        coursePrefixInput.value = "I'm pursuing";
    } else if (type === 'an Alumni') {
        coursePrefixInput.value = "I pursue";
    }

    // Adjust the width of the coursePrefixInput based on its value
    // coursePrefixInput.style.width = `${coursePrefixInput.value.length + 0.5}ch`; // +2 for padding
    // Adjust the width of the coursePrefixInput based on its value
    coursePrefixInput.style.width = `${Math.min(coursePrefixInput.value.length + 1, 10)}ch`; // Limit to max 20 characters


    // Hide the dropdown after selection
    document.getElementById('accountTypeDropdown').classList.add('hidden');
}

// Close the dropdown if clicked outside
document.addEventListener('click', function (event) {
    const dropdown = document.getElementById('accountTypeDropdown');
    const inputField = document.getElementById('accountType');
    const editIcon = document.getElementById('editAccountTypeIcon');

    if (!dropdown.contains(event.target) && event.target !== inputField && event.target !== editIcon) {
        dropdown.classList.add('hidden');
    }
});

// Allow editing of the course input field
document.getElementById('editCourseIcon').addEventListener('click', function () {
    const courseInput = document.getElementById('courseInput');
    courseInput.removeAttribute('readonly');
    courseInput.focus();

    // Revert to read-only mode after editing
    courseInput.addEventListener('blur', function () {
        courseInput.setAttribute('readonly', true);
    });
});


// Allow editing of the school input field
document.getElementById('editSchoolIcon').addEventListener('click', function () {
    const schoolInput = document.getElementById('schoolInput');
    schoolInput.removeAttribute('readonly');
    schoolInput.focus();

    // Revert to read-only mode after editing
    schoolInput.addEventListener('blur', function () {
        schoolInput.setAttribute('readonly', true);
    });
});


// Allow editing of the address input field
document.getElementById('editAddressIcon').addEventListener('click', function () {
    const addressInput = document.getElementById('addressInput');
    addressInput.removeAttribute('readonly');
    addressInput.focus();

    // Revert to read-only mode after editing
    addressInput.addEventListener('blur', function () {
        addressInput.setAttribute('readonly', true);
    });
});

// Manage Post Button Functionality
document.getElementById('managePostBtn').addEventListener('click', function () {
    const icon = document.getElementById('managePostIcon');
    icon.classList.toggle('rotate');
    document.getElementById('managePostSection').classList.remove('hidden');
});

// Close Manage Your Post Section
document.getElementById('closeManagePost').addEventListener('click', function () {
    document.getElementById('managePostSection').classList.add('hidden');
});

// Delete Selected Posts
document.getElementById('deletePostsBtn').addEventListener('click', function () {
    const checkedPosts = Array.from(document.querySelectorAll('#managePostsGrid input[type="checkbox"]:checked'));

    checkedPosts.forEach(checkbox => {
        const postId = parseInt(checkbox.closest('div').dataset.postId);
        posts = posts.filter(post => post.id !== postId);
    });

    displayPosts();
});

// Cancel Manage Your Post
document.getElementById('cancelManageBtn').addEventListener('click', function () {
    document.getElementById('managePostSection').classList.add('hidden');
});

// Function to display posts
function displayPosts() {
    const postsDisplay = document.getElementById('postsDisplay');
    postsDisplay.innerHTML = '';

    const managePostsGrid = document.getElementById('managePostsGrid');
    const noPostsMessage = document.getElementById('noPostsMessage');

    // Clear previous posts
    managePostsGrid.innerHTML = '';

    if (posts.length > 0) {
        noPostsMessage.classList.add('hidden'); // Hide no posts message
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'p-4 border border-gray-300 rounded-md relative';
            postElement.dataset.postId = post.id; // Add data attribute for post ID

            postElement.innerHTML = `
                <input type="checkbox" class="absolute top-2 right-2">
                <p class="text-gray-800">${post.content}</p>
                <div class="flex items-center space-x-4 mt-2">
                    <button onclick="likePost(${post.id})" class="text-blue-500 hover:underline">Like (${post.likes})</button>
                    <button onclick="toggleCommentSection(${post.id})" class="text-blue-500 hover:underline">Comment (${post.comments.length})</button>
                </div>
            `;

            managePostsGrid.appendChild(postElement);
        });
    } else {
        noPostsMessage.classList.remove('hidden'); // Show no posts message
    }
}



//About the post
