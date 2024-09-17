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

class SocialPostServicesDB {
  static COLLECTION_NAME = "social_posts";

  /**
   * Generates a unique social post ID.
   *
   * @return {string} - A unique social post ID.
   */
  generateUniqueSocialPostId() {
    return "SP" + doc(collection(db, SocialPostServicesDB.COLLECTION_NAME)).id;
  }

  /**
   * Adds a new social post to the Firestore database.
   *
   * @param {Object} socialPost - The social post object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addSocialPost(socialPost) {
    const socialPostRef = doc(
      db,
      SocialPostServicesDB.COLLECTION_NAME,
      socialPost.social_post_id
    );

    try {
      await setDoc(socialPostRef, socialPost);
      console.log(
        `Social post added successfully: ${socialPost.social_post_id}`
      );
    } catch (e) {
      console.error(
        `Error adding social post: ${socialPost.social_post_id}`,
        e
      );
      throw e;
    }
  }

  /**
   * Deletes a social post from the Firestore database by its ID.
   *
   * @param {string} socialPostId - The unique ID of the social post to be deleted.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async deleteSocialPostById(socialPostId) {
    const socialPostRef = doc(
      db,
      SocialPostServicesDB.COLLECTION_NAME,
      socialPostId
    );

    try {
      await deleteDoc(socialPostRef);
      console.log(`Social post deleted successfully: ${socialPostId}`);
    } catch (e) {
      console.error(`Error deleting social post: ${socialPostId}`, e);
      throw e;
    }
  }

  /**
   * Retrieves a social post from the Firestore database by its ID.
   *
   * @param {string} socialPostId - The unique ID of the social post.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the post.
   */
  async getSocialPostById(socialPostId) {
    const socialPostRef = doc(
      db,
      SocialPostServicesDB.COLLECTION_NAME,
      socialPostId
    );

    try {
      const docSnap = await getDoc(socialPostRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("Social post document does not exist.");
      }
    } catch (e) {
      console.error(`Error fetching social post: ${socialPostId}`, e);
      throw e;
    }
  }

  /**
   * Retrieves all social posts from the Firestore database.
   *
   * @return {Promise<Object[]>} - A promise representing the asynchronous operation to fetch the posts.
   */
  async getAllSocialPosts() {
    const q = query(collection(db, SocialPostServicesDB.COLLECTION_NAME));

    try {
      const querySnapshot = await getDocs(q);
      const socialPosts = [];
      querySnapshot.forEach((doc) => {
        socialPosts.push(doc.data());
      });
      return socialPosts;
    } catch (e) {
      console.error("Error fetching all social posts", e);
      throw e;
    }
  }
}

export default SocialPostServicesDB;
