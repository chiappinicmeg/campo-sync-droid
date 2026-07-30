import { openDB, type IDBPDatabase } from 'idb';
import type { SupervisionRecord } from '@/types/records';

const DB_NAME = 'supervisao-psi';
const DB_VERSION = 1;
const STORE_NAME = 'records';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('formType', 'formType');
        store.createIndex('syncStatus', 'syncStatus');
        store.createIndex('createdAt', 'createdAt');
      },
    });
  }
  return dbPromise;
}

export async function getAllRecords(): Promise<SupervisionRecord[]> {
  const db = await getDB();
  const records = await db.getAll(STORE_NAME);
  return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getRecord(id: string): Promise<SupervisionRecord | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function saveRecord(record: SupervisionRecord): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, record);
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function getPendingRecords(): Promise<SupervisionRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex(STORE_NAME, 'syncStatus', 'pending');
}

export async function markAsSynced(ids: string[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const id of ids) {
    const record = await tx.store.get(id);
    if (record) {
      record.syncStatus = 'synced';
      await tx.store.put(record);
    }
  }
  await tx.done;
}

export async function getPendingCount(): Promise<number> {
  const db = await getDB();
  return db.countFromIndex(STORE_NAME, 'syncStatus', 'pending');
}
