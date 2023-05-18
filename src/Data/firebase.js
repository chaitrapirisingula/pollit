import { firebaseConfig } from './config';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFirestore, collection, addDoc} from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut, updateProfile } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const realtime = getDatabase(app);

/**
 * Logins in user and alerts if invalid.
 * 
 * @param {*} email 
 * @param {*} password 
 */
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Creates new user account.
 * 
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 */
export const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
    alert('Account created.');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Sends password reset email.
 * 
 * @param {*} email 
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert('Check your email to reset your password.');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Signs out user.
 */
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

/**
 * Uploads or updates profile picture for user.
 * 
 * @param {*} file 
 * @param {*} user 
 * @param {*} setLoading 
 */
export const uploadProfilePic = async (file, user, setLoading) => {
  try {
    const fileRef = ref(storage, user.uid + '.png');
    setLoading(true);
    await uploadBytes(fileRef, file);
    const photoURL = await getDownloadURL(fileRef);
    updateProfile(user, {photoURL});
    setLoading(false);
    alert('Uploaded Image!');
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Export database variables.
export { auth, db, app, storage, realtime };
