// Import and configure Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAfEOtlc_i8OjcTXm0FHSFnWQ9iqcyvyHk",
  authDomain: "alumnihub-cebe5.firebaseapp.com",
  projectId: "alumnihub-cebe5",
  storageBucket: "alumnihub-cebe5.appspot.com",
  messagingSenderId: "369833807869",
  appId: "1:369833807869:android:b0b1a53eb51796ee6f1394"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Register user function
window.registerUser = async function() {
  // Get user input values
  const name = document.getElementById('regName').value;
  const enrollmentNo = document.getElementById('regEnrollmentNo').value;
  const department = document.getElementById('regDepartment').value;
  const year = document.getElementById('regYear').value;
  const userType = document.getElementById('user-type').value;
  const contactNo = document.getElementById('regContactNo').value;
  const email = document.getElementById('regEmailId').value;
  const password = document.getElementById('regPassword').value;

  try {
    // Create user with Firebase Authentication
    await createUserWithEmailAndPassword(auth, email, password);

    // Save user data in the database
    await set(ref(database, 'users/' + enrollmentNo), {
      name: name,
      enrollmentNo: enrollmentNo,
      department: department,
      graduationYear: year,
      userType: userType,
      contactNo: contactNo,
      email: email,
      // password: password // Be cautious with storing passwords in plain text
    });

    alert('Registration successful!');
  } catch (error) {
    console.error('Error registering user:', error);
    alert('Registration failed. Please try again.');
  }
}

// Login user function
window.validateLogin = async function() {
  // Get user input values
  const email = document.getElementById('regEmailId').value;
  const password = document.getElementById('loginPassword').value;

  try {
    // Sign in with Firebase Authentication
    await signInWithEmailAndPassword(auth, email, password);

    // Fetch additional user data from Firebase Realtime Database (optional)
    const userRef = ref(database, 'users/' + email.split('@')[0]); // Assuming enrollment number or unique ID is the email prefix
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log('User data:', userData);
      alert('Login successful!');
      // Redirect or proceed with logged-in user
      // window.location.href = 'dashboard.html'; // Example redirect
    } else {
      alert('No user data found.');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    alert('Login failed. Please check your credentials and try again.');
  }
}
