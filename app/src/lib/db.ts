import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { ensureFirebase } from '../setup/firebase';

export type UserDoc = { uid: string; email?: string; createdAt: number };
export type ChannelDoc = { id: string; ownerUid: string; chat_id: string; title?: string; utm?: string };
export type IdeaDoc = { id: string; ownerUid: string; title: string; url: string; topic?: string; createdAt: number };
export type PostDoc = { id: string; ownerUid: string; channelId: string; title: string; text: string; status: 'draft'|'review'|'approved'|'scheduled'|'sent'|'archived'; scheduledAt?: number; createdAt: number; updatedAt: number };

const LS = typeof localStorage === 'undefined' ? null : localStorage;

export async function upsertUser(docIn: UserDoc) {
  try {
    const { db } = ensureFirebase();
    await setDoc(doc(db, 'users', docIn.uid), docIn, { merge: true });
  } catch {
    if (LS) LS.setItem(`users.${docIn.uid}`, JSON.stringify(docIn));
  }
}

export async function listChannels(ownerUid: string): Promise<ChannelDoc[]> {
  try {
    const { db } = ensureFirebase();
    const q = query(collection(db, 'channels'), where('ownerUid', '==', ownerUid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
  } catch {
    if (!LS) return [];
    const raw = LS.getItem(`channels.byOwner.${ownerUid}`);
    return raw ? JSON.parse(raw) : [];
  }
}

export async function saveChannel(ch: ChannelDoc) {
  try {
    const { db } = ensureFirebase();
    await setDoc(doc(db, 'channels', ch.id), ch, { merge: true });
  } catch {
    if (!LS) return;
    const key = `channels.byOwner.${ch.ownerUid}`;
    const list: ChannelDoc[] = JSON.parse(LS.getItem(key) || '[]');
    const idx = list.findIndex(i => i.id === ch.id);
    if (idx >= 0) list[idx] = ch; else list.push(ch);
    LS.setItem(key, JSON.stringify(list));
  }
}

import { ensureFirebase } from '../setup/firebase';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';

export function col(path: string) {
  const { db } = ensureFirebase();
  return collection(db, path);
}

export function ref(path: string) {
  const { db } = ensureFirebase();
  return doc(db, path);
}

export async function create(path: string, data: any) {
  const c = col(path);
  const res = await addDoc(c, { ...data, createdAt: Date.now() });
  return res.id;
}

export async function createWithId(path: string, id: string, data: any) {
  await setDoc(ref(`${path}/${id}`), { ...data, createdAt: Date.now() });
  return id;
}

export async function read(path: string) {
  const snap = await getDoc(ref(path));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function list(path: string, opts?: { where?: [string, any, any]; order?: [string, 'asc' | 'desc'] }) {
  let q: any = col(path);
  if (opts?.where) q = query(q, where(opts.where[0], opts.where[1], opts.where[2]));
  if (opts?.order) q = query(q, orderBy(opts.order[0], opts.order[1]));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function update(path: string, data: any) {
  await updateDoc(ref(path), { ...data, updatedAt: Date.now() });
}

export async function remove(path: string) {
  await deleteDoc(ref(path));
}

export function watch(path: string, cb: (docs: any[]) => void) {
  const q = col(path);
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

