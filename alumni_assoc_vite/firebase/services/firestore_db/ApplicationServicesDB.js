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

class ApplicationServicesDB {
  static TAG = "ApplicationServices";
  static COLLECTION_NAME = "verification_applications";

  /**
   * Generates a unique application ID.
   *
   * @return {string} - A unique application ID.
   */
  generateUniqueApplicationId() {
    return "AI" + doc(collection(db, ApplicationServicesDB.COLLECTION_NAME)).id;
  }

  /**
   * Adds a new application to the Firestore database.
   *
   * @param {Object} application - The application object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addApplication(application) {
    const applicationId = application.application_id;
    console.log(
      `${ApplicationServicesDB.TAG}: Adding application: ${applicationId}`
    );

    const applicationRef = doc(
      db,
      ApplicationServicesDB.COLLECTION_NAME,
      applicationId
    );

    try {
      await setDoc(applicationRef, application);
      console.log(
        `${ApplicationServicesDB.TAG}: Application added successfully: ${applicationId}`
      );
    } catch (e) {
      console.error(
        `${ApplicationServicesDB.TAG}: Error adding application: ${applicationId}`,
        e
      );
    }
  }

  /**
   * Updates an existing application in the Firestore database.
   *
   * @param {Object} application - The updated application object.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async updateApplication(application) {
    const applicationId = application.application_id;
    const applicationRef = doc(
      db,
      ApplicationServicesDB.COLLECTION_NAME,
      applicationId
    );

    try {
      await setDoc(applicationRef, application);
      console.log(
        `${ApplicationServicesDB.TAG}: Application updated successfully: ${applicationId}`
      );
    } catch (e) {
      console.error(
        `${ApplicationServicesDB.TAG}: Error updating application: ${applicationId}`,
        e
      );
    }
  }

  /**
   * Retrieves an application from the Firestore database.
   *
   * @param {string} applicationId - The unique ID of the application.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the application.
   */
  async getApplication(applicationId) {
    const applicationRef = doc(
      db,
      ApplicationServicesDB.COLLECTION_NAME,
      applicationId
    );

    try {
      const docSnap = await getDoc(applicationRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("Application document does not exist.");
      }
    } catch (e) {
      console.error(
        `${ApplicationServicesDB.TAG}: Error fetching application: ${applicationId}`,
        e
      );
      throw e;
    }
  }

  /**
   * Retrieves all applications from the Firestore database.
   *
   * @return {Promise<Object[]>} - A promise representing the asynchronous operation to fetch the applications.
   */
  async getAllApplications() {
    const q = query(collection(db, ApplicationServicesDB.COLLECTION_NAME));

    try {
      const querySnapshot = await getDocs(q);
      const applications = [];
      querySnapshot.forEach((doc) => {
        applications.push(doc.data());
      });
      return applications;
    } catch (e) {
      console.error(
        `${ApplicationServicesDB.TAG}: Error fetching all applications`,
        e
      );
      throw e;
    }
  }

  /**
   * Deletes an application from the Firestore database by its ID.
   *
   * @param {string} applicationId - The unique ID of the application to be deleted.
   * @return {Promise<void>} - A promise representing the asynchronous operation to delete the application.
   */
  async deleteApplicationById(applicationId) {
    const applicationRef = doc(
      db,
      ApplicationServicesDB.COLLECTION_NAME,
      applicationId
    );

    try {
      await deleteDoc(applicationRef);
      console.log(
        `${ApplicationServicesDB.TAG}: Application deleted successfully: ${applicationId}`
      );
    } catch (e) {
      console.error(
        `${ApplicationServicesDB.TAG}: Error deleting application: ${applicationId}`,
        e
      );
    }
  }
}

export default ApplicationServicesDB;
