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

class EventServicesDB {
  static TAG = "EventServiceDB";
  static COLLECTION_NAME = "events";

  /**
   * Generates a unique event ID.
   *
   * @return {string} - A unique event ID.
   */
  generateUniqueEventId() {
    return "EI" + doc(collection(db, EventServicesDB.COLLECTION_NAME)).id;
  }

  /**
   * Adds a new event to the Firestore database.
   *
   * @param {Object} event - The event object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addEvent(event) {
    const eventId = event.event_id;
    const eventRef = doc(db, EventServicesDB.COLLECTION_NAME, eventId);

    try {
      await setDoc(eventRef, event);
      console.log(
        `${EventServicesDB.TAG}: Event added successfully: ${eventId}`
      );
    } catch (e) {
      console.error(
        `${EventServicesDB.TAG}: Error adding event: ${eventId}`,
        e
      );
    }
  }

  /**
   * Deletes an event from the Firestore database.
   *
   * @param {string} eventId - The ID of the event to be deleted.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async deleteEvent(eventId) {
    const eventRef = doc(db, EventServicesDB.COLLECTION_NAME, eventId);

    try {
      await deleteDoc(eventRef);
      console.log(
        `${EventServicesDB.TAG}: Event deleted successfully: ${eventId}`
      );
    } catch (e) {
      console.error(
        `${EventServicesDB.TAG}: Error deleting event: ${eventId}`,
        e
      );
    }
  }

  /**
   * Retrieves a particular event from the Firestore database.
   *
   * @param {string} eventId - The ID of the event to retrieve.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the event.
   */
  async getEvent(eventId) {
    const eventRef = doc(db, EventServicesDB.COLLECTION_NAME, eventId);

    try {
      const docSnap = await getDoc(eventRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("Event document does not exist.");
      }
    } catch (e) {
      console.error(
        `${EventServicesDB.TAG}: Error fetching event: ${eventId}`,
        e
      );
      throw e;
    }
  }

  /**
   * Retrieves a list of all events from the Firestore database.
   *
   * @return {Promise<Object[]>} - A promise representing the asynchronous operation to fetch all events.
   */
  async getAllEvents() {
    const q = query(collection(db, EventServicesDB.COLLECTION_NAME));

    try {
      const querySnapshot = await getDocs(q);
      const events = [];
      querySnapshot.forEach((doc) => {
        events.push(doc.data());
      });
      return events;
    } catch (e) {
      console.error(`${EventServicesDB.TAG}: Error fetching all events`, e);
      throw e;
    }
  }
}

export default EventServicesDB;
