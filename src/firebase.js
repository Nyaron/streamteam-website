import firebase from 'firebase/app';
import 'firebase/firestore';
import { config } from './config';

firebase.initializeApp(config.firebase);

const db = firebase.firestore();

export { db as default };
