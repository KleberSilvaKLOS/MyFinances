import { initializeApp, getApps, getApp } from "firebase/app";
// 1. Adicionamos initializeAuth e getReactNativePersistence
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// 2. Importamos o AsyncStorage
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTy2Fcv1t4jMWgdr8Qrw1oZflTtemGWCQ", 
  authDomain: "myfinance-79f20.firebaseapp.com",
  projectId: "myfinance-79f20",
  storageBucket: "myfinance-79f20.firebasestorage.app",
  messagingSenderId: "1077356751416",
  appId: "1:1077356751416:web:d9ca422304e33619a614cd",
  measurementId: "G-3ESMJKX06K"
};

// Garante que o app só é inicializado uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Lógica blindada para o Login Persistente
let auth;
try {
  // Tenta inicializar com a persistência do React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  // Se o app recarregar rápido (Fast Refresh) e já tiver auth, pega a existente para não dar erro
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);