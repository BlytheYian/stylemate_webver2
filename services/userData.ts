import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { ClothingItem, LikedItem, Match, Request, Transaction, User } from '../types';

export interface UserAppStatePayload {
  myCloset: ClothingItem[];
  matches: Match[];
  likedItems: LikedItem[];
  requests: Request[];
  transactions: Transaction[];
  seenItemIds: string[];
  updatedAt?: any;
}

const COLLECTION = 'userAppStates';
const USER_COLLECTION = 'users';

export async function getUserAppState(userId: string): Promise<UserAppStatePayload | null> {
  if (!userId) return null;
  const docRef = doc(db, COLLECTION, userId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  const data = snapshot.data() as Partial<UserAppStatePayload>;
  return {
    myCloset: data.myCloset || [],
    matches: data.matches || [],
    likedItems: data.likedItems || [],
    requests: data.requests || [],
    transactions: data.transactions || [],
    seenItemIds: data.seenItemIds || [],
    updatedAt: data.updatedAt,
  };
}

export async function saveUserAppState(userId: string, payload: UserAppStatePayload) {
  if (!userId) return;
  const docRef = doc(db, COLLECTION, userId);
  await setDoc(
    docRef,
    {
      ...payload,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function getUserProfile(userId: string): Promise<Partial<User> | null> {
  if (!userId) return null;
  const docRef = doc(db, USER_COLLECTION, userId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Partial<User>;
}

export async function saveUserProfile(user: User) {
  if (!user?.id) return;
  const docRef = doc(db, USER_COLLECTION, user.id);
  await setDoc(
    docRef,
    {
      name: user.name,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      joinDate: user.joinDate,
      phoneNumber: user.phoneNumber || null,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
