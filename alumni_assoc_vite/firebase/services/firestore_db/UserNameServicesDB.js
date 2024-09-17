import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firestore
const db = getFirestore(app);

class UserNameServicesDB {
  static TAG = "UserNameServices";
  static COLLECTION_NAME = "user_names";

  /**
   * Checks if a username already exists in the Firestore database.
   *
   * @param {string} username - The username to check.
   * @return {Promise<boolean>} - A promise representing the asynchronous operation to check existence.
   */
  async doesUsernameExist(username) {
    const userNameRef = doc(db, UserNameServicesDB.COLLECTION_NAME, username);
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
    const userNameRef = doc(db, UserNameServicesDB.COLLECTION_NAME, username);

    // Create an object with the current timestamp
    const userNameObj = {
      created_at: new Date(),
    };

    try {
      await setDoc(userNameRef, userNameObj);
      console.log(
        `${UserNameServicesDB.TAG}: Username added successfully: ${username}`
      );
    } catch (e) {
      console.error(
        `${UserNameServicesDB.TAG}: Error adding username: ${username}`,
        e
      );
    }
  }
}

export default UserNameServicesDB;
