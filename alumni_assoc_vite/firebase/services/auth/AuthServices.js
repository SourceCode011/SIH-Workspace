import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firebase Auth
const mAuth = getAuth(app);

class AuthServices {
  static TAG = "FirebaseAuthService";

  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        mAuth,
        email,
        password
      );
      console.log(
        `${AuthServices.TAG}: User registered successfully: ${email}`
      );
      return userCredential;
    } catch (error) {
      console.error(`${AuthServices.TAG}: Sign up failed: ${error.message}`);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        mAuth,
        email,
        password
      );
      console.log(`${AuthServices.TAG}: User signed in successfully: ${email}`);
      return userCredential;
    } catch (error) {
      console.error(`${AuthServices.TAG}: Sign in failed: ${error.message}`);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(mAuth);
      console.log(`${AuthServices.TAG}: User signed out successfully`);
    } catch (error) {
      console.error(`${AuthServices.TAG}: Sign out failed: ${error.message}`);
      throw error;
    }
  }

  getCurrentUser(callback) {
    onAuthStateChanged(mAuth, (user) => {
      callback(user);
    });
  }

  onAuthStateChanged(callback) {
    onAuthStateChanged(mAuth, callback);
  }
}

export default AuthServices;
