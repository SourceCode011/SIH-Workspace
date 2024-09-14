document.addEventListener('DOMContentLoaded', () => {
    // Load existing job posts when the page loads
    loadJobPosts();
});

function submitJob() {
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const location = document.getElementById('location').value;
    const salary = document.getElementById('salary').value;
    const jobDescription = document.getElementById('jobDescription').value;
    const postStatus = document.getElementById('postStatus');

    const jobPost = {
        title: jobTitle,
        company: companyName,
        location: location,
        salary: salary,
        description: jobDescription
    };

    postStatus.textContent = 'Posting...';

    // Send the job post to the server
    fetch('/post-job', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobPost)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            postStatus.textContent = 'Job posted successfully!';
            addJobToFeed(jobPost);
            document.getElementById('jobForm').reset();
        } else {
            postStatus.textContent = 'Failed to post job. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        postStatus.textContent = 'Failed to post job. Please try again.';
    });
}

// Function to add a job to the feed
function addJobToFeed(job) {
    const jobPosts = document.getElementById('jobPosts');

    const jobItem = document.createElement('div');
    jobItem.className = 'job-item';

    const jobTitle = document.createElement('h3');
    jobTitle.textContent = job.title;

    const jobCompany = document.createElement('p');
    jobCompany.textContent = `Company: ${job.company}`;

    const jobLocation = document.createElement('p');
    jobLocation.textContent = `Location: ${job.location}`;

    const jobSalary = document.createElement('p');
    jobSalary.textContent = `Salary: ${job.salary || 'Not specified'}`;

    const jobDescription = document.createElement('p');
    jobDescription.textContent = job.description;

    jobItem.appendChild(jobTitle);
    jobItem.appendChild(jobCompany);
    jobItem.appendChild(jobLocation);
    jobItem.appendChild(jobSalary);
    jobItem.appendChild(jobDescription);

    jobPosts.prepend(jobItem); // Add new jobs to the top of the feed
}

// Function to load job posts from the server
function loadJobPosts() {
    fetch('/jobs')
        .then(response => response.json())
        .then(data => {
            data.jobs.forEach(job => addJobToFeed(job));
        })
        .catch(error => console.error('Error loading job posts:', error));
}
