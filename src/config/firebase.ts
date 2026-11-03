import { initializeApp, getApps, getApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB4vQme3TW8s31nTF7_FlqRMaexYznyrac",
  authDomain: "my-finances-app-abc25.firebaseapp.com",
  databaseURL: "https://my-finances-app-abc25-default-rtdb.firebaseio.com",
  projectId: "my-finances-app-abc25",
  storageBucket: "my-finances-app-abc25.firebasestorage.app",
  messagingSenderId: "101659990601",
  appId: "1:101659990601:web:2d3f42d1801ee9d2c67d98",
  measurementId: "G-9SZ493EE25"
};

// 1. Inicializa o Firebase App sem duplicar instâncias
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Inicializa o Auth com AsyncStorage seguro contra erros de tipagem e Fast Refresh
let auth: FirebaseAuth.Auth;

try {
  const getPersistence = (FirebaseAuth as any).getReactNativePersistence;
  auth = FirebaseAuth.initializeAuth(app, {
    persistence: getPersistence ? getPersistence(AsyncStorage) : undefined,
  });
} catch (error) {
  // Caso o Auth já tenha sido inicializado durante o Fast Refresh do Expo
  auth = FirebaseAuth.getAuth(app);
}

const db = getFirestore(app);

export { app, auth, db };