import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { generateSalt, hashPasswordAsync, verifyPasswordAsync } from './hash';

export type UserRecord = {
  id: string;
  email: string;
  displayName: string;
  salt: string;
  passwordHash: string;
  createdAt: number;
};

export type PublicUser = Omit<UserRecord, 'salt' | 'passwordHash'>;

type AuthState = {
  users: Record<string, UserRecord>;
  currentUserId: string | null;
  hasHydrated: boolean;

  register: (input: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<PublicUser>;
  login: (input: { email: string; password: string }) => Promise<PublicUser>;
  logout: () => void;
  updateProfile: (patch: { displayName?: string; email?: string }) => PublicUser;
  changePassword: (input: { currentPassword: string; newPassword: string }) => Promise<void>;
  currentUser: () => PublicUser | null;

  _setHasHydrated: (v: boolean) => void;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublic(r: UserRecord): PublicUser {
  return {
    id: r.id,
    email: r.email,
    displayName: r.displayName,
    createdAt: r.createdAt,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: {},
      currentUserId: null,
      hasHydrated: false,

      register: async ({ email, password, displayName }) => {
        const key = normalizeEmail(email);
        const { users } = get();
        if (users[key]) {
          throw new Error('An account already exists for this email');
        }
        const salt = generateSalt();
        // Async so the "Create account" button's spinner keeps animating and
        // incoming touches stay responsive during the 10k-iteration hash.
        const passwordHash = await hashPasswordAsync(password, salt);
        const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const record: UserRecord = {
          id,
          email: key,
          displayName: displayName.trim(),
          salt,
          passwordHash,
          createdAt: Date.now(),
        };
        set({
          users: { ...users, [key]: record },
          currentUserId: id,
        });
        return toPublic(record);
      },

      login: async ({ email, password }) => {
        const key = normalizeEmail(email);
        const { users } = get();
        const record = users[key];
        if (!record) {
          throw new Error('No account found for that email');
        }
        // Async so the Sign-in button's spinner keeps ticking and the screen
        // doesn't appear frozen during password verification.
        const ok = await verifyPasswordAsync(password, record.salt, record.passwordHash);
        if (!ok) {
          throw new Error('Incorrect password');
        }
        set({ currentUserId: record.id });
        return toPublic(record);
      },

      logout: () => set({ currentUserId: null }),

      updateProfile: patch => {
        const { users, currentUserId } = get();
        if (!currentUserId) throw new Error('Not signed in');
        const entry = Object.entries(users).find(([, u]) => u.id === currentUserId);
        if (!entry) throw new Error('User record missing');
        const [oldKey, record] = entry;
        const newEmail = patch.email ? normalizeEmail(patch.email) : record.email;
        if (newEmail !== oldKey && users[newEmail]) {
          throw new Error('Email is already in use');
        }
        const updated: UserRecord = {
          ...record,
          displayName: patch.displayName?.trim() ?? record.displayName,
          email: newEmail,
        };
        const next = { ...users };
        if (newEmail !== oldKey) {
          delete next[oldKey];
        }
        next[newEmail] = updated;
        set({ users: next });
        return toPublic(updated);
      },

      changePassword: async ({ currentPassword, newPassword }) => {
        const { users, currentUserId } = get();
        if (!currentUserId) throw new Error('Not signed in');
        const entry = Object.entries(users).find(([, u]) => u.id === currentUserId);
        if (!entry) throw new Error('User record missing');
        const [key, record] = entry;
        // Two async hashes here — verify the old password, hash the new one.
        const ok = await verifyPasswordAsync(currentPassword, record.salt, record.passwordHash);
        if (!ok) throw new Error('Current password is incorrect');
        const salt = generateSalt();
        const passwordHash = await hashPasswordAsync(newPassword, salt);
        set({
          users: { ...users, [key]: { ...record, salt, passwordHash } },
        });
      },

      currentUser: () => {
        const { users, currentUserId } = get();
        if (!currentUserId) return null;
        const found = Object.values(users).find(u => u.id === currentUserId);
        return found ? toPublic(found) : null;
      },

      _setHasHydrated: v => set({ hasHydrated: v }),
    }),
    {
      name: 'altlite-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ users: state.users, currentUserId: state.currentUserId }),
      onRehydrateStorage: () => state => {
        state?._setHasHydrated(true);
      },
    },
  ),
);

export function useCurrentUser(): PublicUser | null {
  const users = useAuthStore(s => s.users);
  const currentUserId = useAuthStore(s => s.currentUserId);
  if (!currentUserId) return null;
  const record = Object.values(users).find(u => u.id === currentUserId);
  return record ? toPublic(record) : null;
}
