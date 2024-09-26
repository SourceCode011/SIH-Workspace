import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firestore
const db = getFirestore(app);

class UnvPostServices {
  static COLLECTION_NAME = "unv_posts";

  /**
   * Generates a unique university post ID.
   *
   * @return {string} - A unique university post ID.
   */
  generateUniqueUnvPostId() {
    return "UP" + doc(collection(db, UnvPostServices.COLLECTION_NAME)).id;
  }

  /**
   * Adds a new university post to the Firestore database.
   *
   * @param {Object} unvPost - The university post object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addUnvPost(unvPost) {
    const unvPostRef = doc(
      db,
      UnvPostServices.COLLECTION_NAME,
      unvPost.unv_post_id
    );

    try {
      await setDoc(unvPostRef, unvPost);
      console.log(`University post added successfully: ${unvPost.unv_post_id}`);
    } catch (e) {
      console.error(`Error adding university post: ${unvPost.unv_post_id}`, e);
      throw e;
    }
  }

  /**
   * Deletes a university post from the Firestore database by its ID.
   *
   * @param {string} unvPostId - The unique ID of the university post to be deleted.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async deleteUnvPostById(unvPostId) {
    const unvPostRef = doc(db, UnvPostServices.COLLECTION_NAME, unvPostId);

    try {
      await deleteDoc(unvPostRef);
      console.log(`University post deleted successfully: ${unvPostId}`);
    } catch (e) {
      console.error(`Error deleting university post: ${unvPostId}`, e);
      throw e;
    }
  }

  /**
   * Retrieves a university post from the Firestore database by its ID.
   *
   * @param {string} unvPostId - The unique ID of the university post.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the post.
   */
  async getUnvPostById(unvPostId) {
    const unvPostRef = doc(db, UnvPostServices.COLLECTION_NAME, unvPostId);

    try {
      const docSnap = await getDoc(unvPostRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("University post document does not exist.");
      }
    } catch (e) {
      console.error(`Error fetching university post: ${unvPostId}`, e);
      throw e;
    }
  }

  /**
   * Retrieves all university posts from the Firestore database.
   *
   * @return {Promise<Object[]>} - A promise representing the asynchronous operation to fetch the posts.
   */
  async getAllUnvPosts() {
    const q = query(collection(db, UnvPostServices.COLLECTION_NAME));

    try {
      const querySnapshot = await getDocs(q);
      const unvPosts = [];
      querySnapshot.forEach((doc) => {
        unvPosts.push(doc.data());
      });
      return unvPosts;
    } catch (e) {
      console.error("Error fetching all university posts", e);
      throw e;
    }
  }
}

export default UnvPostServices;
