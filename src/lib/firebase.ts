
import { config } from 'dotenv';
import * as admin from 'firebase-admin';

// Load environment variables from .env file
config();

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY
} = process.env;

const hasAllCredentials = FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY;

// Log to help with debugging
if (!process.env.FIREBASE_PROJECT_ID) {
  console.log("Firebase credentials not found. Make sure to set FIREBASE_PROJECT_ID in your .env file.");
}

let firestore: admin.firestore.Firestore | null = null;
let firebaseAdmin: typeof admin | null = null;

// Initialize Firebase only if all credentials are provided and no app has been initialized yet.
if (hasAllCredentials && !admin.apps.length) {
  try {
    const privateKey = FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    
    firestore = admin.firestore();
    firebaseAdmin = admin;
    console.log('Firebase Admin initialized successfully.');

  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
    // Gracefully handle the error, firestore will remain null.
  }
} else if (admin.apps.length) {
    // If an app is already initialized, just get the firestore instance.
    firestore = admin.firestore();
    firebaseAdmin = admin;
} else {
    console.log("Firebase Admin SDK not initialized: Missing credentials.");
}


export { firestore, firebaseAdmin as admin };
