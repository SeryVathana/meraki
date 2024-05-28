// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

export const firebaseConfig = {
  apiKey: "AIzaSyAmIB_SAYYT5-UdN62Aw_KXfGUPgK1-Ofs",

  authDomain: "imageupload-c1c01.firebaseapp.com",

  projectId: "imageupload-c1c01",

  storageBucket: "imageupload-c1c01.appspot.com",

  messagingSenderId: "431536651988",

  appId: "1:431536651988:web:234b76db2584868bb5c541",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const storageRef = ref(storage);
