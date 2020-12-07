import * as firebase from "firebase";
import "firebase/firestore";
import "firebase/auth";
import "@firebase/functions";

import {
  API_KEY_B,
  AUTH_DOMAIN_B,
  DATABASE_URL_B,
  PROJECT_ID_B,
  MESSAGE_SENDER_ID_B,
  APP_ID_B,
  MEASUREMENT_Id,
  STORAGE_BUCKET_B,
} from "@env";

const firebaseConfig = {
  apiKey: API_KEY_B,
  authDomain: AUTH_DOMAIN_B,
  databaseURL: DATABASE_URL_B,
  projectId: PROJECT_ID_B,
  storageBucket: STORAGE_BUCKET_B,
  messagingSenderId: MESSAGE_SENDER_ID_B,
  appId: APP_ID_B,
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);
export const db_auth = firebase.auth();
export const db_store = firebase.firestore();
export const func = firebase.functions();
