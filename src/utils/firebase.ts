import { initializeApp, getApps } from 'firebase/app';
import { getDatabase as fbGetDatabase, Database } from 'firebase/database';

let database: Database | null = null;

export const initializeFirebase = () => {
  if (database) return database;

  // Firebase configuration from environment variables
  const firebaseConfig = {
      apiKey: "AIzaSyB8ms2shEg2SUPE63tSKWmtazlnizCqykw",
  authDomain: "grommetxn.firebaseapp.com",
  databaseURL: "https://grommetxn-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "grommetxn",
  storageBucket: "grommetxn.firebasestorage.app",
  messagingSenderId: "962590269970",
  appId: "1:962590269970:web:16f81ff112daf4d60feecb"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  database = fbGetDatabase(app);
  return database;
};

export const getDatabase = () => {
  if (!database) {
    initializeFirebase();
  }
  return database!;
};
