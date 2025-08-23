
import * as admin from 'firebase-admin';

// This is a server-side only file.
// IMPORTANT: Replace the placeholder values with your actual Firebase service account credentials.
// You can get this from your Firebase project settings -> Service accounts -> Generate new private key.
// It is recommended to store these credentials securely, for example, in environment variables.

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Initialize Firebase only if the project ID is available
if (serviceAccount.projectId && !admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      // You can also add your databaseURL here if needed
      // databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
    });
  } catch (error: any) {
    console.error('Firebase Admin Initialization Error:', error.message);
    // You can decide how to handle this error, maybe gracefully degrade features
  }
}

const firestore = admin.apps.length ? admin.firestore() : null;

export { firestore, admin };
