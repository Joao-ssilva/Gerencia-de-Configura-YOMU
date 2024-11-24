// Initialize Firebase
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
const config = {
  apiKey: "AIzaSyClTCzWIGRA-_IpgVp2Sku7PnZC7JDpTbg",
  authDomain: "yomu-btle.firebaseapp.com",
  databaseURL: "https://yomu-btle-default-rtdb.firebaseio.com",
  projectId: "yomu-btle",
  storageBucket: "yomu-btle.appspot.com",
  messagingSenderId: "806851651533",
  appId: "1:806851651533:web:d33d799b23ee5c0f234684"
};
firebase.initializeApp(config);
// TODO: VERIFICAR SE A CONEXÃO FOI BEM FEITA!

const rootRef = firebase.database().ref();
const storageRef = firebase.storage().ref();
