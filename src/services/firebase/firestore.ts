import { Firestore, getFirestore } from 'firebase/firestore';
import { getFirebaseApp, isFirebaseConfigured } from './config';

let dbInstance: Firestore | null = null;

export function getFirestoreDb(): Firestore {
  if (!dbInstance) {
    dbInstance = getFirestore(getFirebaseApp());
  }
  return dbInstance;
}

export function isFirestoreAvailable(): boolean {
  return isFirebaseConfigured();
}
