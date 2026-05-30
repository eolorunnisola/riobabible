import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { User } from 'firebase/auth';
import {
  changeUserPassword,
  deleteCurrentUser,
  deleteUserAppData,
  getCurrentFirebaseUser,
  isFirebaseConfigured,
  isRegisteredUser,
  reauthenticateUser,
  registerWithEmail,
  reloadCurrentUser,
  sendPasswordReset,
  sendVerificationEmail,
  signInWithEmail,
  signOutUser,
  subscribeToAuthState,
} from '@/src/services/firebase';
import { getAuthErrorMessage } from '@/src/services/firebase/authErrors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorageKeys } from '@/src/utils/storageKeys';

type AuthContextValue = {
  user: User | null;
  authReady: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  firebaseRequired: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshUser: () => Promise<boolean>;
  /** Sends a password-reset email (used by "Forgot password" at sign in). */
  resetPassword: (email: string) => Promise<void>;
  /** Re-authenticates with the current password, then sets a new one. */
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  /** Permanently deletes the account, cloud data, and local cache. */
  deleteAccount: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const firebaseRequired = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  // Tracked separately from `user` because `reload()` mutates the existing
  // User object in place (same reference), so `setUser` alone won't trigger a
  // re-render when emailVerified flips. A dedicated boolean guarantees one.
  const [emailVerified, setEmailVerified] = useState(false);
  const [authReady, setAuthReady] = useState(!firebaseRequired);

  useEffect(() => {
    if (!firebaseRequired) return;
    return subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setEmailVerified(Boolean(nextUser?.emailVerified));
      setAuthReady(true);
    });
  }, [firebaseRequired]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    try {
      await registerWithEmail(email, password, displayName);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await signOutUser();
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const resendVerification = useCallback(async () => {
    try {
      await sendVerificationEmail();
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const refreshed = await reloadCurrentUser();
      const verified = Boolean(refreshed?.emailVerified);
      setUser(refreshed);
      setEmailVerified(verified);
      return verified;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      await sendPasswordReset(email);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        // Firebase requires a recent login before changing the password.
        await reauthenticateUser(currentPassword);
        await changeUserPassword(newPassword);
      } catch (error) {
        throw new Error(getAuthErrorMessage(error));
      }
    },
    [],
  );

  const deleteAccount = useCallback(async (password: string) => {
    try {
      const current = getCurrentFirebaseUser();
      if (!current) {
        throw new Error('You must be signed in to delete your account.');
      }
      const uid = current.uid;
      // Firebase requires a recent login before deleting an account.
      await reauthenticateUser(password);
      // Remove cloud data while still authenticated (best-effort).
      try {
        await deleteUserAppData(uid);
      } catch {
        // Non-fatal: continue deleting the auth account.
      }
      await deleteCurrentUser();
      // Clear this user's local cache so nothing lingers on the device.
      try {
        await AsyncStorage.multiRemove(Object.values(getStorageKeys(uid)));
      } catch {
        // Non-fatal cleanup.
      }
    } catch (error) {
      throw new Error(getAuthErrorMessage(error));
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      authReady,
      isAuthenticated: isRegisteredUser(user),
      isEmailVerified: emailVerified,
      firebaseRequired,
      signIn,
      signUp,
      signOut,
      resendVerification,
      refreshUser,
      resetPassword,
      changePassword,
      deleteAccount,
    }),
    [
      user,
      authReady,
      emailVerified,
      firebaseRequired,
      signIn,
      signUp,
      signOut,
      resendVerification,
      refreshUser,
      resetPassword,
      changePassword,
      deleteAccount,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
