# Firebase environment variables

This project reads Firebase client config from environment variables. Create a `.env.local` file in the project root with the following values (example):

NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

Notes:
- Variables prefixed with `NEXT_PUBLIC_` are embedded in the client bundle and are safe to be publicly visible (Firebase client config is not a secret).
- For server-only secrets (service account keys), use server environment variables without the `NEXT_PUBLIC_` prefix and do not commit them.
- After creating `.env.local` restart your dev server (`npm run dev`).
