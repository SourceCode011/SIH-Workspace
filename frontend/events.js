document.addEventListener('DOMContentLoaded', () => {
    // Load existing events when the page loads
    loadEventPosts();
});

function submitEvent() {
    const eventTitle = document.getElementById('eventTitle').value;
    const eventLocation = document.getElementById('eventLocation').value;
    const eventDate = document.getElementById('eventDate').value;
    const eventTime = document.getElementById('eventTime').value;
    const eventDescription = document.getElementById('eventDescription').value;
    const postStatus = document.getElementById('postStatus');

    const eventPost = {
        title: eventTitle,
        location: eventLocation,
        date: eventDate,
        time: eventTime,
        description: eventDescription
    };

    postStatus.textContent = 'Posting...';

    // Send the event post to the server
    fetch('/post-event', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPost)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            postStatus.textContent = 'Event posted successfully!';
            addEventToFeed(eventPost);
            document.getElementById('eventForm').reset();
        } else {
            postStatus.textContent = 'Failed to post event. Please try again.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        postStatus.textContent = 'Failed to post event. Please try again.';
    });
}

// Function to add an event to the feed
function addEventToFeed(event) {
    const eventPosts = document.getElementById('eventPosts');

    const eventItem = document.createElement('div');
    eventItem.className = 'event-item';

    const eventTitle = document.createElement('h3');
    eventTitle.textContent = event.title;

    const eventLocation = document.createElement('p');
    eventLocation.textContent = `Location: ${event.location}`;

    const eventDate = document.createElement('p');
    eventDate.textContent = `Date: ${event.date}`;

    const eventTime = document.createElement('p');
    eventTime.textContent = `Time: ${event.time}`;

    const eventDescription = document.createElement('p');
    eventDescription.textContent = event.description;

    eventItem.appendChild(eventTitle);
    eventItem.appendChild(eventLocation);
    eventItem.appendChild(eventDate);
    eventItem.appendChild(eventTime);
    eventItem.appendChild(eventDescription);

    eventPosts.prepend(eventItem); // Add new events to the top of the feed
}

// Function to load event posts from the server
function loadEventPosts() {
    fetch('/events')
        .then(response => response.json())
        .then(data => {
            data.events.forEach(event => addEventToFeed(event));
        })
        .catch(error => console.error('Error loading event posts:', error));
}
