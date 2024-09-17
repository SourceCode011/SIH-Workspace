import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
} from "firebase/firestore";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firestore
const db = getFirestore(app);

class UserServicesDB {
  static TAG = "UserServices";
  static COLLECTION_NAME = "users";

  /**
   * Adds a new user to the Firestore database.
   *
   * @param {string} user_id - The unique ID of the user.
   * @param {string} username - The username of the user.
   * @param {string} email - The email address of the user.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addUser(user_id, username, email) {
    console.log(`${UserServicesDB.TAG}: Adding user: ${user_id}`);

    // Create a plain object to store in Firestore
    const userObj = {
      user_id: user_id,
      user_name: username,
      email: email,
      bio: null,
      contact_num: null,
      current_location: null,
      domain: null,
      enrollment_num: null,
      full_name: null,
      graduation_year: null,
      id_proof_url: null,
      is_complete: false,
      is_verified: false,
      pf_pic_url: null,
      posts: [],
      type: null,
      workplace: null,
      year_of_study: null,
    };

    // Reference to the "users" collection
    const userRef = doc(db, UserServicesDB.COLLECTION_NAME, user_id);

    try {
      await setDoc(userRef, userObj);
      console.log(`${UserServicesDB.TAG}: User added successfully: ${user_id}`);
    } catch (e) {
      console.error(`${UserServicesDB.TAG}: Error adding user: ${user_id}`, e);
    }
  }

  /**
   * Updates an existing user in the Firestore database.
   *
   * @param {string} user_id - The unique ID of the user.
   * @param {Object} updatedUser - The updated user object.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async updateUser(user_id, updatedUser) {
    const userRef = doc(db, UserServicesDB.COLLECTION_NAME, user_id);

    try {
      await setDoc(userRef, updatedUser);
      console.log(
        `${UserServicesDB.TAG}: User updated successfully: ${user_id}`
      );
    } catch (e) {
      console.error(
        `${UserServicesDB.TAG}: Error updating user: ${user_id}`,
        e
      );
    }
  }

  /**
   * Retrieves a user from the Firestore database.
   *
   * @param {string} userId - The unique ID of the user.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the user.
   */
  async getUser(userId) {
    const userRef = doc(db, UserServicesDB.COLLECTION_NAME, userId);

    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("User document does not exist.");
      }
    } catch (e) {
      console.error(`${UserServicesDB.TAG}: Error fetching user: ${userId}`, e);
      throw e;
    }
  }

  /**
   * Fetches a user from the Firestore database based on the given username.
   *
   * @param {string} username - The username of the user to fetch.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the user.
   */
  async getUserByUsername(username) {
    const q = query(
      collection(db, UserServicesDB.COLLECTION_NAME),
      where("user_name", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      } else {
        throw new Error("User not found.");
      }
    } catch (e) {
      console.error(
        `${UserServicesDB.TAG}: Error fetching user by username: ${username}`,
        e
      );
      throw e;
    }
  }

  /**
   * Fetches users from the Firestore database whose usernames match the given substring.
   *
   * @param {string} partialUsername - The substring of the username to match.
   * @return {Promise<Object[]>} - A promise representing the asynchronous operation to fetch the users.
   */
  async getUsersByPartialUsername(partialUsername) {
    const endString = partialUsername + "\uf8ff";
    const q = query(
      collection(db, UserServicesDB.COLLECTION_NAME),
      where("user_name", ">=", partialUsername),
      where("user_name", "<=", endString)
    );

    try {
      const querySnapshot = await getDocs(q);
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      return users;
    } catch (e) {
      console.error(
        `${UserServicesDB.TAG}: Error fetching users by partial username: ${partialUsername}`,
        e
      );
      throw e;
    }
  }
}

export default UserServicesDB;
