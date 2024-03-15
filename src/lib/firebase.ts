import { initializeApp } from "firebase/app";
import { atom, useAtomValue } from "jotai"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomaihn: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const firebaseApp = initializeApp(firebaseConfig)

export const authStateAtom = atom<{
    user: {
        id: string,
        idToken: string,
    } | null,
    isLoading: boolean,
}>({
    user: null,
    isLoading: true
})

export const useAuthState = () => {
    return useAtomValue(authStateAtom)
}