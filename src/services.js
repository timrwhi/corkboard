import firebase from 'firebase/app';
import 'firebase/database';

firebase.initializeApp({
  apiKey: "AIzaSyDNrF1am5Jw4YUuYpYXXvRWEO46w-7cqh8",
  authDomain: "fart-17799.firebaseapp.com",
  databaseURL: "https://fart-17799.firebaseio.com",
  projectId: "fart-17799",
  storageBucket: "fart-17799.appspot.com",
  messagingSenderId: "970125185444"
});

export const fetchCollection = (id) =>
  new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`collections/${id}`)
      .once('value')
      .then(data => resolve(data.toJSON()));
  });

export const saveCollection = (id, items) =>
  new Promise((resolve, reject) => {
    console.log(id, items)
    firebase
      .database()
      .ref(`collections/${id}`)
      .set(items)
      .then(() => {
        resolve()
      });
  });