import * as firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGMIBMOcKUoNYf3lBPw60UTV7REcxUARU",
  authDomain: "to-do-brief.firebaseapp.com",
  databaseURL: "https://to-do-brief.firebaseio.com",
  projectId: "to-do-brief",
  storageBucket: "to-do-brief.appspot.com",
  messagingSenderId: "301390009829",
  appId: "1:301390009829:web:a6b63b8b126da505"
};

firebase.initializeApp(firebaseConfig);

export const provider = new firebase.auth.GoogleAuthProvider();

export const firestore = firebase.firestore();

export default firebase;
