import firebase from 'firebase/app';

const config = {
  apiKey: 'AIzaSyBKryjfCuRkcdJ78oWP3Rc62sadePOR9ts',
  authDomain: 'chat-web-app-a7513.firebaseapp.com',
  projectId: 'chat-web-app-a7513',
  storageBucket: 'chat-web-app-a7513.appspot.com',
  messagingSenderId: '402282199602',
  appId: '1:402282199602:web:0292debad45215e8091a2b',
};

// Initialize Firebase get its instance
const app = firebase.initializeApp(config);
