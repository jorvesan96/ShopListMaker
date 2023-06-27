import { initializeApp } from 'firebase/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export const environment = {
  firebase: {
    projectId: 'shoplistmaker-7b5a6',
    appId: '1:362997270004:web:2490a5b79f93db8c3065a1',
    storageBucket: 'shoplistmaker-7b5a6.appspot.com',
    apiKey: 'AIzaSyDGx7Z0cMDqSJeAKwzDV8EOMrYNJ7PasHw',
    authDomain: 'shoplistmaker-7b5a6.firebaseapp.com',
    messagingSenderId: '362997270004',
    measurementId: 'G-4B3LLR1YQT',
  },
};

const app = initializeApp(environment.firebase);
