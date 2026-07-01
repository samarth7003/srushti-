// Unified Cloud Storage + Base64 Local fallback helper
const isFirebaseConfigured = () => {
  return !!(
    import.meta.env &&
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
};

export const uploadImage = async (file) => {
  if (isFirebaseConfigured()) {
    // If Firebase is configured, implement Firebase Storage uploading:
    // const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    // await uploadBytes(storageRef, file);
    // return await getDownloadURL(storageRef);
  }

  // Fallback: Read file as Base64 for fully interactive local experience
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
