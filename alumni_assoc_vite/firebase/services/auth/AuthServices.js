import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firebase Auth
const mAuth = getAuth(app);

class AuthServices {
    static TAG = "FirebaseAuthService";

    /**
     * Method for signing up a new user.
     *
     * @param {string} email - The email address of the new user.
     * @param {string} password - The password for the new user.
     * @return {Promise<AuthResult>} - A promise representing the asynchronous sign-up operation.
     */
    async signUp(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(mAuth, email, password);
            console.log(`${AuthServices.TAG}: User registered successfully: ${email}`);
            return userCredential;
        } catch (error) {
            console.error(`${AuthServices.TAG}: Sign up failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Method for signing in an existing user.
     *
     * @param {string} email - The email address of the user.
     * @param {string} password - The password for the user.
     * @return {Promise<AuthResult>} - A promise representing the asynchronous sign-in operation.
     */
    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(mAuth, email, password);
            console.log(`${AuthServices.TAG}: User signed in successfully: ${email}`);
            return userCredential;
        } catch (error) {
            console.error(`${AuthServices.TAG}: Sign in failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Method for signing out the current user.
     */
    async signOut() {
        try {
            await signOut(mAuth);
            console.log(`${AuthServices.TAG}: User signed out successfully`);
        } catch (error) {
            console.error(`${AuthServices.TAG}: Sign out failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get the currently signed-in user.
     *
     * @return {FirebaseUser|null} - The currently signed-in FirebaseUser, or null if no user is signed in.
     */
    getCurrentUser() {
        return mAuth.currentUser;
    }
}

export default AuthServices;