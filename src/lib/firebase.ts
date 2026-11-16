/**
 * Configuración para Fase 2: Firebase Firestore & Authentication
 * 
 * Para activar la sincronización en tiempo real y autenticación del encargado:
 * 1. Crea un proyecto en https://console.firebase.google.com
 * 2. Habilita Cloud Firestore y Authentication (Email/Password o Google)
 * 3. Crea un archivo .env.local en la raíz con tus credenciales:
 *    VITE_FIREBASE_API_KEY=tu_api_key
 *    VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
 *    VITE_FIREBASE_PROJECT_ID=tu_proyecto
 *    VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
 *    VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
 *    VITE_FIREBASE_APP_ID=tu_app_id
 */

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const estaFirebaseConfigurado = (): boolean => {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
};
