import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { getAuth } from 'firebase/auth';

const config = {
  apiKey: process.env.NEXT_PUBLIC_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_APPID,
}

const app = firebase.initializeApp(config);
const auth = getAuth(app);

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export const firebaseApp = auth;