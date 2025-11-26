# Firebase Admin (server) environment variables

This project uses the Firebase Admin SDK in server-side API routes to perform privileged operations (verify ID tokens, write protected Firestore documents, etc.).

Set these environment variables on your server (for example in `.env.local` on a server-only machine, or in your host's secret/env dashboard). These values must NOT be exposed to the browser.

FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-service-account-client-email
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

Notes and tips:
- The private key often contains literal newlines. If your environment or hosting UI doesn't accept multiline values, store the key with `\\n` in place of real newlines. The project's server helper (`lib/firebase-admin.ts`) will replace `\\n` with actual newlines at runtime.
- Do NOT prefix these with `NEXT_PUBLIC_` — they must remain server-only.
- On Vercel, Netlify, or other hosts, add these as project/secret environment variables in the dashboard.
- After adding server env vars, restart your server so Next.js picks them up.

If admin env vars are not set, server routes that depend on the Admin SDK will throw an informative error:

`Firebase Admin not initialized. Set FIREBASE_ADMIN_* env variables`

Keep these values out of version control.
