import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configuração do Firebase.
 * Insira sua apiKey válida do Console do Firebase quando for utilizar autenticação remota.
 */
const firebaseConfig = {
  apiKey: "AIzaSyD-SUA_CHAVE_AQUI", // Insira sua API Key real aqui
  authDomain: "myfinance-79f20.firebaseapp.com",
  projectId: "myfinance-79f20",
  storageBucket: "myfinance-79f20.firebasestorage.app",
  messagingSenderId: "1077356751416",
  appId: "1:1077356751416:web:d9ca422304e33619a614cd",
  measurementId: "G-3ESMJKX06K"
};

let app: any = null;
let auth: Auth | any = null;
let db: Firestore | any = null;

// Inicializa o Firebase apenas se houver uma chave configurada, evitando quebrar o app local
if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("SUA_CHAVE_AQUI")) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
      });
    } catch {
      auth = getAuth(app);
    }

    db = getFirestore(app);
  } catch (error) {
    console.warn("Aviso: Falha ao inicializar Firebase. O app seguirá em modo offline.", error);
  }
}

export { auth, db };