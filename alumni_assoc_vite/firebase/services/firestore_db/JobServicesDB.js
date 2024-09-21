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

class JobServicesDB {
  static COLLECTION_NAME = "jobs";

  /**
   * Generates a unique job ID.
   *
   * @return {string} - A unique job ID.
   */
  generateUniqueJobId() {
    return "JI" + doc(collection(db, JobServicesDB.COLLECTION_NAME)).id;
  }

  /**
   * Adds a new job to the Firestore database.
   *
   * @param {Object} job - The job object to be added.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async addJob(job) {
    const jobRef = doc(db, JobServicesDB.COLLECTION_NAME, job.job_id);

    try {
      await setDoc(jobRef, job);
      console.log(`Job added successfully: ${job.job_id}`);
    } catch (e) {
      console.error(`Error adding job: ${job.job_id}`, e);
      throw e;
    }
  }

  /**
   * Deletes a job from the Firestore database by its ID.
   *
   * @param {string} jobId - The unique ID of the job to be deleted.
   * @return {Promise<void>} - A promise representing the asynchronous operation.
   */
  async deleteJob(jobId) {
    const jobRef = doc(db, JobServicesDB.COLLECTION_NAME, jobId);

    try {
      await deleteDoc(jobRef);
      console.log(`Job deleted successfully: ${jobId}`);
    } catch (e) {
      console.error(`Error deleting job: ${jobId}`, e);
      throw e;
    }
  }

  /**
   * Retrieves a job from the Firestore database by its ID.
   *
   * @param {string} jobId - The unique ID of the job.
   * @return {Promise<Object>} - A promise representing the asynchronous operation to fetch the job.
   */
  async getJob(jobId) {
    const jobRef = doc(db, JobServicesDB.COLLECTION_NAME, jobId);

    try {
      const docSnap = await getDoc(jobRef);
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        throw new Error("Job document does not exist.");
      }
    } catch (e) {
      console.error(`Error fetching job: ${jobId}`, e);
      throw e;
    }
  }

  /**
   * Retrieves all jobs from the Firestore database.
   *
   * @return {Promise<Object[]>} - A promise representing the asynchronous operation to fetch the jobs.
   */
  async getAllJobs() {
    const q = query(collection(db, JobServicesDB.COLLECTION_NAME));

    try {
      const querySnapshot = await getDocs(q);
      const jobs = [];
      querySnapshot.forEach((doc) => {
        jobs.push(doc.data());
      });
      return jobs;
    } catch (e) {
      console.error("Error fetching all jobs", e);
      throw e;
    }
  }
}

export default JobServicesDB;
