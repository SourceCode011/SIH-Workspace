// file: backend_services/firestore_db/UniversityServicesDB.js

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
} from "firebase/firestore";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firestore
const db = getFirestore(app);

class UniversityServicesDB {
  static TAG = "UniversityServicesDB";
  static COLLECTION_NAME = "university";
  static POSTS_COLLECTION_NAME = "unv_posts";

  /**
   * Updates an existing university in the Firestore database.
   *
   * @param {Object} university - The university object to be updated.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async updateUniversity(university) {
    const unvId = university.unv_id;
    const universityRef = doc(db, UniversityServicesDB.COLLECTION_NAME, unvId);

    try {
      await setDoc(universityRef, university);
      console.log(
        `${UniversityServicesDB.TAG}: University updated successfully: ${unvId}`
      );
    } catch (e) {
      console.error(
        `${UniversityServicesDB.TAG}: Error updating university: ${unvId}`,
        e
      );
      throw e;
    }
  }

  /**
   * Retrieves a particular university from the Firestore database.
   *
   * @param {string} unvId - The ID of the university to retrieve.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the university.
   */
  async getUniversityById(unvId) {
    const universityRef = doc(db, UniversityServicesDB.COLLECTION_NAME, unvId);

    try {
      const docSnap = await getDoc(universityRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("University document does not exist.");
      }
    } catch (e) {
      console.error(
        `${UniversityServicesDB.TAG}: Error fetching university: ${unvId}`,
        e
      );
      throw e;
    }
  }

  /**
   * Adds a new university post to the Firestore database.
   *
   * @param {Object} unvPost - The university post object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addUniversityPost(unvPost) {
    const postId = unvPost.post_id;
    const postRef = doc(db, UniversityServicesDB.POSTS_COLLECTION_NAME, postId);

    try {
      await setDoc(postRef, unvPost);
      console.log(
        `${UniversityServicesDB.TAG}: University post added successfully: ${postId}`
      );
    } catch (e) {
      console.error(
        `${UniversityServicesDB.TAG}: Error adding university post: ${postId}`,
        e
      );
      throw e;
    }
  }
}

export default UniversityServicesDB;
