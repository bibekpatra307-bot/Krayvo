// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe2LRnVIUWhROFBevXemEJJMUzqLW0Azc",
  authDomain: "krayvo-131a8.firebaseapp.com",
  projectId: "krayvo-131a8",
  storageBucket: "krayvo-131a8.firebasestorage.app",
  messagingSenderId: "278539390638",
  appId: "1:278539390638:web:38cefde7899eb3c883a73f"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
