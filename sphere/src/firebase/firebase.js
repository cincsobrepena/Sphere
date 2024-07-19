import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

  apiKey: "AIzaSyA4wogwTEPKPzpI4KjMStGGUXUUNVkbo8Q",

  authDomain: "sphere-34644.firebaseapp.com",

  projectId: "sphere-34644",

  storageBucket: "sphere-34644.appspot.com",

  messagingSenderId: "723607444080",

  appId: "1:723607444080:web:258ff5d37ce53242baf2b5"

};
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 