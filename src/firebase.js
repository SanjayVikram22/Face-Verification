import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const firebaseConfig = {
  apiKey: "AIzaSyARl5GvFM_1sf2cBP3Rmi-Fqv2Tr9i-knc",
  authDomain: "face-attendance-36b4a.firebaseapp.com",
  databaseURL: "https://face-attendance-36b4a-default-rtdb.firebaseio.com",
  projectId: "face-attendance-36b4a",
  storageBucket: "face-attendance-36b4a.appspot.com",
  messagingSenderId: "151824837555",
  appId: "1:151824837555:web:c8056906254a994d0ab9c6",
  measurementId: "G-1K7H7E5L7L",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);