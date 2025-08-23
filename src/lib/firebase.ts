import * as admin from 'firebase-admin';

// This is a server-side only file.
// IMPORTANT: Replace the placeholder values with your actual Firebase service account credentials.
// You can get this from your Firebase project settings -> Service accounts -> Generate new private key.
// It is recommended to store these credentials securely, for example, in environment variables.

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com',
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n').replace(/\\n/g, '\n'),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // You can also add your databaseURL here if needed
    // databaseURL: `https://${service.projectId}.firebaseio.com`
  });
}

const firestore = admin.firestore();

export { firestore, admin };
