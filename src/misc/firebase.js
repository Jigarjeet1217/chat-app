import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const config = {
  apiKey: 'AIzaSyBKryjfCuRkcdJ78oWP3Rc62sadePOR9ts',
  authDomain: 'chat-web-app-a7513.firebaseapp.com',
  databaseURL: 'https://chat-web-app-a7513-default-rtdb.firebaseio.com',
  projectId: 'chat-web-app-a7513',
  storageBucket: 'chat-web-app-a7513.appspot.com',
  messagingSenderId: '402282199602',
  appId: '1:402282199602:web:0292debad45215e8091a2b',
};

// Initialize Firebase get its instance
const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();
export const storage = app.storage();
