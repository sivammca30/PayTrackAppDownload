# PayTrack registration

The registration page stores submissions in the Firestore `registrations`
collection. After a successful write, visitors are sent to the download page
using a query parameter so the route works on static hosts such as GitHub Pages.
They can download `public/paytrack.apk` using the **Download PayTrack APK** link.
Asset URLs are relative so the site also works when deployed under a repository
path on GitHub Pages.

## Configure Firebase

Create a Firebase project, enable Cloud Firestore, and add a web app. Put its
configuration values in a local `.env` file at the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Restart the Vite server after changing `.env`. These Firebase web-app values
are public client configuration; configure Firestore security rules and enable
Firebase App Check before production use. Firestore rules must allow validated
registration document creation in the `registrations` collection.

## Run locally

```sh
npm install
npm run dev
```
