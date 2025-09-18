import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {addDoc, collection, getFirestore, deleteDoc, doc, getDocs, query, where} from "firebase/firestore"
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyA9R7QbDmS7iuXWRaQiy-q6ijXi6Fc1V84",
  authDomain: "netflix-clone-4c5c0.firebaseapp.com",
  projectId: "netflix-clone-4c5c0",
  storageBucket: "netflix-clone-4c5c0.firebasestorage.app",
  messagingSenderId: "643489876168",
  appId: "1:643489876168:web:a950f70c1bb2dbc7197dfd",
  measurementId: "G-6HS6FE7543"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "user"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email
    });
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "));
  }
}

const logout = () => {
  signOut(auth);
}

const addToWishlist = async (userId, movieData) => {
  try {
    await addDoc(collection(db, "wishlist"), {
      userId: userId,
      movieId: movieData.id,
      title: movieData.title,
      poster_path: movieData.poster_path,
      vote_average: movieData.vote_average,
      release_date: movieData.release_date,
      addedAt: new Date()
    });
    toast.success("Added to wishlist!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to add to wishlist");
  }
}

const removeFromWishlist = async (userId, movieId) => {
  try {
    const q = query(collection(db, "wishlist"), 
      where("userId", "==", userId), 
      where("movieId", "==", movieId)
    );
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach(async (document) => {
      await deleteDoc(doc(db, "wishlist", document.id));
    });
    
    toast.success("Removed from wishlist!");
  } catch (error) {
    console.log(error);
    toast.error("Failed to remove from wishlist");
  }
}

const getUserWishlist = async (userId) => {
  try {
    const q = query(collection(db, "wishlist"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const wishlist = [];
    
    querySnapshot.forEach((doc) => {
      wishlist.push({ id: doc.id, ...doc.data() });
    });
    
    return wishlist;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const checkIfInWishlist = async (userId, movieId) => {
  try {
    const q = query(collection(db, "wishlist"), 
      where("userId", "==", userId), 
      where("movieId", "==", movieId)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export {
  auth, 
  db, 
  login, 
  signup, 
  logout, 
  addToWishlist, 
  removeFromWishlist, 
  getUserWishlist, 
  checkIfInWishlist
};