//firestrageに接続して、呼び出す準備をしている。
const { initializeApp } = require("firebase/app");
const { getStorage } = require("firebase/storage");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbC18P4p7i75CIGy7V0YkQe82F0SJtqz0",
  authDomain: "photo-upload-ver2.firebaseapp.com",
  projectId: "photo-upload-ver2",
  storageBucket: "photo-upload-ver2.appspot.com",
  messagingSenderId: "487236611866",
  appId: "1:487236611866:web:ccf66771f07d796af7c6a3",
  measurementId: "G-C850WWQKQV"
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
module.exports = getStorage(firebaseApp);