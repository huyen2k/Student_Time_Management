import { auth } from "../Infrastructure/firebase"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth"
import type { User } from "firebase/auth"

export async function register(email: string, password: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    return cred.user
}

export async function login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    return cred.user
}

export async function logout(): Promise<void> {
    await signOut(auth)
}
