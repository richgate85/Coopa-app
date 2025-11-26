import admin from 'firebase-admin'

// Initialize Firebase Admin using service account info from env.
// Expect the following env vars to be set for server:
// - FIREBASE_ADMIN_PROJECT_ID
// - FIREBASE_ADMIN_CLIENT_EMAIL
// - FIREBASE_ADMIN_PRIVATE_KEY (replace literal newlines with actual newlines)

function initAdmin() {
  if (admin.apps && admin.apps.length) return admin.app()

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    // Running without admin credentials; throw when used.
    return null
  }

  // In many environments the private key has escaped newlines.
  privateKey = privateKey.replace(/\\n/g, '\n')

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })

  return app
}

const adminApp = initAdmin()

export function verifyIdToken(idToken: string) {
  if (!adminApp) throw new Error('Firebase Admin not initialized. Set FIREBASE_ADMIN_* env variables')
  return admin.auth().verifyIdToken(idToken)
}

export const adminAuth = adminApp ? admin.auth() : null
export const adminFirestore = adminApp ? admin.firestore() : null
export { admin as adminSdk }
