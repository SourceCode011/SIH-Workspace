import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import config from "../../config.js"; // Adjust the path as necessary

// Initialize Firebase
const app = initializeApp(config);
const db = getFirestore(app);

class UserNameServicesDB {
    static TAG = "UserNameServices";

    /**
     * Checks if a username already exists in the Firestore database.
     *
     * @param {string} username - The username to check.
     * @return {Promise<boolean>} - A promise representing the asynchronous operation to check existence.
     */
    async doesUsernameExist(username) {
        const userNameRef = doc(db, "user_names", username);
        const docSnap = await getDoc(userNameRef);
        return docSnap.exists();
    }

    /**
     * Adds a new username to the Firestore database.
     *
     * @param {string} username - The username to be added.
     * @return {Promise<void>} - A promise representing the asynchronous operation.
     */
    async addUsername(username) {
        console.log(`${UserNameServicesDB.TAG}: Adding username: ${username}`);
        const userNameRef = doc(db, "user_names", username);

        try {
            await setDoc(userNameRef, {});
            console.log(`${UserNameServicesDB.TAG}: Username added successfully: ${username}`);
        } catch (e) {
            console.error(`${UserNameServicesDB.TAG}: Error adding username: ${username}`, e);
        }
    }
}

export default UserNameServicesDB;