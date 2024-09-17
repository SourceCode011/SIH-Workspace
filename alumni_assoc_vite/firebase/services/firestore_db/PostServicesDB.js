import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firestore
const db = getFirestore(app);

class PostServicesDB {
  static COLLECTION_NAME = "posts";

  /**
   * Generates a unique post ID.
   *
   * @return {string} - A unique post ID.
   */
  generateUniquePostId() {
    return "PI" + doc(collection(db, PostServicesDB.COLLECTION_NAME)).id;
  }

  /**
   * Retrieves a post from the Firestore database by its ID.
   *
   * @param {string} postId - The unique ID of the post.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the post.
   */
  async getPostById(postId) {
    const postRef = doc(db, PostServicesDB.COLLECTION_NAME, postId);

    try {
      const docSnap = await getDoc(postRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("Post document does not exist.");
      }
    } catch (e) {
      console.error(`Error fetching post: ${postId}`, e);
      throw e;
    }
  }

  /**
   * Deletes a post from the Firestore database by its ID.
   *
   * @param {string} postId - The unique ID of the post to be deleted.
   * @return {Promise<void>} - A promise representing the asynchronous operation to delete the post.
   */
  async deletePostById(postId) {
    const postRef = doc(db, PostServicesDB.COLLECTION_NAME, postId);

    try {
      await deleteDoc(postRef);
      console.log(`Post deleted successfully: ${postId}`);
    } catch (e) {
      console.error(`Error deleting post: ${postId}`, e);
      throw e;
    }
  }

  /**
   * Retrieves all posts of a particular user from the Firestore database by user ID.
   *
   * @param {string} userId - The unique ID of the user.
   * @return {Promise<Object[]>} - A promise representing the asynchronous operation to fetch the posts.
   */
  async getPostsByUserId(userId) {
    const q = query(
      collection(db, PostServicesDB.COLLECTION_NAME),
      where("user_id", "==", userId)
    );

    try {
      const querySnapshot = await getDocs(q);
      const posts = [];
      querySnapshot.forEach((doc) => {
        posts.push(doc.data());
      });
      return posts;
    } catch (e) {
      console.error(`Error fetching posts for user: ${userId}`, e);
      throw e;
    }
  }

  /**
   * Adds a new post to the Firestore database.
   *
   * @param {Object} post - The post object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation to add the post.
   */
  async addPost(post) {
    const postRef = doc(db, PostServicesDB.COLLECTION_NAME, post.post_id);

    try {
      await setDoc(postRef, post);
      console.log(`Post added successfully: ${post.post_id}`);
    } catch (e) {
      console.error(`Error adding post: ${post.post_id}`, e);
      throw e;
    }
  }
}

export default PostServicesDB;
