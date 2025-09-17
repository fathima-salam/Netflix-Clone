import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {addDoc, collection, getFirestore} from "firebase/firestore"
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
const auth = getAuth(app)
const db = getFirestore(app)


const signup = async (name,email,password)=>{
    try {
       const res = await createUserWithEmailAndPassword(auth,email,password)
       const user =res.user;
       await addDoc(collection(db, "user"),{
        uid: user.uid,
        name,
        authProvider: "local",
        email
       })
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))
    }
}

const login =async (email,password)=>{
    try {
       await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
        console.log(error)
        toast.error(error.code.split('/')[1].split('-').join(" "));
    }
}

const logout = ()=>{
    signOut(auth)
}

export {auth ,db , login, signup, logout}