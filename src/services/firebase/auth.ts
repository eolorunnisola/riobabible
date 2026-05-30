import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Auth,
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  reauthenticateWithCredential,
  reload,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  type User,
} from 'firebase/auth';
import { getFirebaseApp, isFirebaseConfigured } from './config';

let authInstance: Auth | null = null;

function initFirebaseAuth(): Auth {
  const app = getFirebaseApp();
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error: unknown) {
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code: string }).code)
        : '';
    if (code === 'auth/already-initialized') {
      return getAuth(app);
    }
    throw error;
  }
}

export function getFirebaseAuth(): Auth {
  if (!authInstance) {
    authInstance = initFirebaseAuth();
  }
  return authInstance;
}

export function isRegisteredUser(user: User | null): boolean {
  return Boolean(user && !user.isAnonymous);
}

export function getCurrentFirebaseUser(): User | null {
  if (!isFirebaseConfigured()) return null;
  try {
    return getFirebaseAuth().currentUser;
  } catch {
    return null;
  }
}

export function subscribeToAuthState(onChange: (user: User | null) => void): () => void {
  if (!isFirebaseConfigured()) {
    onChange(null);
    return () => {};
  }
  return onAuthStateChanged(getFirebaseAuth(), onChange);
}

export async function registerWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<User> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (displayName?.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }
  await sendEmailVerification(credential.user);
  return credential.user;
}

/** (Re)send the verification email to the currently signed-in user. */
export async function sendVerificationEmail(): Promise<void> {
  const user = getCurrentFirebaseUser();
  if (!user) {
    throw new Error('You must be signed in to verify your email.');
  }
  await sendEmailVerification(user);
}

/**
 * Refresh the cached user from the server so `emailVerified` reflects the
 * latest state after the user taps the verification link.
 */
export async function reloadCurrentUser(): Promise<User | null> {
  const user = getCurrentFirebaseUser();
  if (!user) return null;
  await reload(user);
  return getFirebaseAuth().currentUser;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function requireRegisteredUser(): User {
  const user = getCurrentFirebaseUser();
  if (!isRegisteredUser(user)) {
    throw new Error('You must be signed in to sync data.');
  }
  return user!;
}

/**
 * Re-authenticate the current user with their password. Firebase requires a
 * recent login before sensitive operations like account deletion.
 */
export async function reauthenticateUser(password: string): Promise<void> {
  const user = getCurrentFirebaseUser();
  if (!user || !user.email) {
    throw new Error('You must be signed in to continue.');
  }
  const credential = EmailAuthProvider.credential(user.email, password);
  await reauthenticateWithCredential(user, credential);
}

/** Email a password-reset link to the given address. */
export async function sendPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  await sendPasswordResetEmail(auth, email.trim());
}

/** Set a new password for the currently signed-in user. */
export async function changeUserPassword(newPassword: string): Promise<void> {
  const user = getCurrentFirebaseUser();
  if (!user) {
    throw new Error('You must be signed in to change your password.');
  }
  await updatePassword(user, newPassword);
}

/** Permanently delete the current Firebase auth account. */
export async function deleteCurrentUser(): Promise<void> {
  const user = getCurrentFirebaseUser();
  if (!user) {
    throw new Error('You must be signed in to delete your account.');
  }
  await deleteUser(user);
}
