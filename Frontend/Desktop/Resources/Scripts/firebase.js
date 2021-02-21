// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyD3RDvxoCjrXnTJbuROOfPbb4sGtsKOBgw",
    authDomain: "playground-6b61d.firebaseapp.com",
    databaseURL: "https://playground-6b61d-default-rtdb.firebaseio.com",
    projectId: "playground-6b61d",
    storageBucket: "playground-6b61d.appspot.com",
    messagingSenderId: "891545843654",
    appId: "1:891545843654:web:ee08ae0fc28c8a95cea4c7",
    measurementId: "G-QK2G1G5460"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
db.settings({timestampsInSnapshots: true});

