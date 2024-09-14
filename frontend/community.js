// Connect to WebSocket server (replace with your actual server URL)
const socket = new WebSocket('ws://localhost:8080');

socket.onopen = function(event) {
    console.log('Connected to the WebSocket server');
};

// Listen for messages
socket.onmessage = function(event) {
    const messagesContainer = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.className = 'message';
    newMessage.textContent = event.data;
    messagesContainer.appendChild(newMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
};

// Send a message to the server
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (message) {
        socket.send(message); // Send message to WebSocket server
        input.value = ''; // Clear input
    }
}

// Handle connection errors
socket.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};

// Handle connection close
socket.onclose = function(event) {
    console.log('Disconnected from WebSocket server');
};
