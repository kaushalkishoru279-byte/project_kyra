
import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file at the very top
config();

// This is a server-side only file.
// It uses environment variables to securely connect to Firebase.
// Make sure you have set up FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL,
// and FIREBASE_PRIVATE_KEY in your deployment environment.

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY
} = process.env;

const hasAllCredentials = FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY;

let firestore: admin.firestore.Firestore | null = null;

// Initialize Firebase only if all credentials are provided and no app has been initialized yet.
if (hasAllCredentials && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        // The private key needs to have its escaped newlines correctly replaced.
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    firestore = admin.firestore();
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
    // Gracefully handle the error, firestore will remain null.
  }
} else if (admin.apps.length) {
    // If an app is already initialized, just get the firestore instance.
    firestore = admin.firestore();
}


export { firestore, admin };
