import { storage } from "../config/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const uploadFile = async (file: File) => {
    try {
      console.log("🔹 Uploading:", file.name);
  
      const storageRef = ref(storage, `products/${Date.now()}-${file.name}`); // Thêm timestamp để tránh trùng file
      const response = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(response.ref);
  
      console.log("✅ Firebase Image URL:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("❌ Upload failed:", error);
      return null;
    }
  };
  
export default uploadFile;

