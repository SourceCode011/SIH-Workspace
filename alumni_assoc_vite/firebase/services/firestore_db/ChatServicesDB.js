import {
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firestore
const db = getFirestore(app);

class ChatServicesDB {
  static COLLECTION_NAME = "chats";

  /**
   * Generates a unique chat message ID.
   *
   * @return {string} - A unique chat message ID.
   */
  generateUniqueChatMessageId() {
    return "CM" + doc(collection(db, ChatServicesDB.COLLECTION_NAME)).id;
  }

  /**
   * Adds a chat message to the Firestore database.
   *
   * @param {Object} chat - The chat message object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addMessage(chat) {
    const chatMessageId = chat.chat_message_id;
    const documentReference = doc(
      db,
      ChatServicesDB.COLLECTION_NAME,
      chatMessageId
    );

    try {
      await setDoc(documentReference, chat);
      console.log("Chat message added successfully.");
    } catch (error) {
      console.error("Error adding chat message:", error);
      throw error;
    }
  }

  /**
   * Fetches the latest 50 chat messages from the Firestore database with real-time updates.
   *
   * @param {function} callback - A callback function to handle the fetched chat messages.
   */
  fetchLatestChatMessages(callback) {
    const chatReference = collection(db, ChatServicesDB.COLLECTION_NAME);
    const chatQuery = query(
      chatReference,
      orderBy("created_at", "desc"),
      limit(50)
    );

    onSnapshot(
      chatQuery,
      (querySnapshot) => {
        const chatMessages = querySnapshot.docs.map((doc) => doc.data());
        callback(chatMessages);
      },
      (error) => {
        console.error("Error fetching chat messages:", error);
      }
    );
  }

  /**
   * Fetches the next 50 chat messages for pagination from the Firestore database.
   *
   * @param {Object} lastVisible - The last visible document from the previous fetch.
   * @param {function} callback - A callback function to handle the fetched chat messages.
   */
  async fetchMoreChatMessages(lastVisible, callback) {
    const chatReference = collection(db, ChatServicesDB.COLLECTION_NAME);
    const chatQuery = query(
      chatReference,
      orderBy("created_at", "desc"),
      startAfter(lastVisible),
      limit(50)
    );

    try {
      const querySnapshot = await getDocs(chatQuery);
      const chatMessages = querySnapshot.docs.map((doc) => doc.data());
      callback(chatMessages);
    } catch (error) {
      console.error("Error fetching more chat messages:", error);
      throw error;
    }
  }
}

export default ChatServicesDB;
