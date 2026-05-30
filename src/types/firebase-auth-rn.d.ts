import type { Persistence } from 'firebase/auth';

/** React Native persistence helper (resolved at runtime via @firebase/auth RN bundle). */
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}

declare module '@firebase/auth' {
  export function getReactNativePersistence(storage: unknown): Persistence;
}
