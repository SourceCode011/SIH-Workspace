import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import app from "../../config.js"; // Adjust the path as necessary

// Initialize Firebase Storage
const storage = getStorage(app);

class StorageServices {
  static TAG = "StorageServices";

  /**
   * Method to upload a file to Firebase Storage.
   *
   * @param {File} file - The file to upload.
   * @param {string} path - The path in Firebase Storage where the file will be stored.
   * @return {Promise<string>} - A promise representing the asynchronous upload operation, resolves with the download URL.
   */
  async uploadFile(file, path) {
    const fileRef = ref(storage, path);

    try {
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      console.log(
        `${StorageServices.TAG}: File uploaded successfully: ${downloadUrl}`
      );
      return downloadUrl;
    } catch (e) {
      console.error(`${StorageServices.TAG}: File upload failed: ${e.message}`);
      throw e;
    }
  }

  /**
   * Method to get the download URL for a file in Firebase Storage.
   *
   * @param {string} path - The path of the file in Firebase Storage.
   * @return {Promise<string>} - A promise representing the asynchronous operation to get the download URL.
   */
  async getDownloadUrl(path) {
    const fileRef = ref(storage, path);

    try {
      const downloadUrl = await getDownloadURL(fileRef);
      console.log(
        `${StorageServices.TAG}: Download URL retrieved successfully: ${downloadUrl}`
      );
      return downloadUrl;
    } catch (e) {
      console.error(
        `${StorageServices.TAG}: Failed to get download URL: ${e.message}`
      );
      throw e;
    }
  }

  /**
   * Method to delete a file from Firebase Storage.
   *
   * @param {string} path - The path of the file in Firebase Storage to delete.
   * @return {Promise<void>} - A promise representing the asynchronous delete operation.
   */
  async deleteFile(path) {
    const fileRef = ref(storage, path);

    try {
      await deleteObject(fileRef);
      console.log(`${StorageServices.TAG}: File deleted successfully: ${path}`);
    } catch (e) {
      console.error(
        `${StorageServices.TAG}: Failed to delete file: ${e.message}`
      );
      throw e;
    }
  }
}

export default StorageServices;
