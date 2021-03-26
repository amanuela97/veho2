import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "@firebase/functions";

import {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  MESSAGE_SENDER_ID,
  APP_ID,
  MEASUREMENT_Id,
  STORAGE_BUCKET,
} from "@env";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGE_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
export const db_auth = firebase.auth();
export const db_store = firebase.firestore();
export const func = firebase.functions();
