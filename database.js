// Firebase configuration for AlumniHub web app
const firebaseConfig = {
    apiKey: "AIzaSyAfEOtlc_i8OjcTXm0FHSFnWQ9iqcyvyHk",
    authDomain: "alumnihub-cebe5.firebaseapp.com",
    projectId: "alumnihub-cebe5",
    storageBucket: "alumnihub-cebe5.appspot.com",
    messagingSenderId: "369833807869",
    appId: "1:369833807869:android:b0b1a53eb51796ee6f1394",  // Replace with your app ID from Firebase
    measurementId: "YOUR_MEASUREMENT_ID" // Optional, for Firebase Analytics
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //Initialize variables
  const auth = firebase.auth()
  const database = firebase.database()
  
  //Set up register function
  function registerUser () {
    //get all input fields
    email = document.getElementById('email').value

    

  }


