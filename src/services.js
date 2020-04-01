import firebase from 'firebase/app';
import 'firebase/database';
import config from './firebase.json';

firebase.initializeApp(config);

export async function fetchMetadata(url) {
  return fetch('https://dumpster-api.sixfstudios.now.sh/metadata', {
    method: 'post',
    body: JSON.stringify({url}),
  }).then(r => r.json());
}

export const fetchCollection = id =>
  new Promise((resolve, reject) => {
    firebase
      .database()
      .ref(`collections/${id}`)
      .once('value')
      .then(data => {
        resolve(data.toJSON() || {});
      });
  });

export const saveCollection = (id, state) =>
  new Promise((resolve, reject) => {
    console.log(id, state);
    firebase
      .database()
      .ref(`collections/${id}`)
      .set(state)
      .then(() => {
        resolve();
      });
  });
