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

