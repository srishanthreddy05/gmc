import { initializeApp, getApps } from 'firebase/app';
import { getDatabase as fbGetDatabase, Database } from 'firebase/database';

let database: Database | null = null;

export const initializeFirebase = () => {
  if (database) return database;

  // Firebase configuration from environment variables
  const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL!, // ✅ REQUIRED
  }
;
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
