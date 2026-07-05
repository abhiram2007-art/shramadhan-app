/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Get Auth and Firestore instances
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Validate connection on boot as mandated by the Firebase Integration Skill
export async function testFirestoreConnection() {
  try {
    const path = 'test/connection';
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase Firestore: Connected successfully');
  } catch (error) {
    if (error && error.message && error.message.includes('offline')) {
      console.warn('Firestore client is offline. Operating in cache-tolerant mode.');
    } else {
      console.warn('Firestore database is initializing or requires custom configuration.', error);
    }
  }
}

// Custom Error Handling Wrapper
export const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

export function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Payload: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication Session State observer wrapper
import { onAuthStateChanged } from 'firebase/auth';
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}
