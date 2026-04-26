import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SyncDB extends DBSchema {
  metrics_queue: {
    key: string;
    value: {
      id: string;
      tenantSlug: string; // CRÍTICO: Identificador del tenant
      metricDefinitionId: string;
      projectId?: string;
      value: number;
      date: string;
      recordedById: string;
      status: 'pending' | 'syncing' | 'error';
    };
    indexes: { 'by-tenant': string };
  };
}

let dbPromise: Promise<IDBPDatabase<SyncDB>> | null = null;

const getDB = () => {
  if (typeof window === 'undefined') return null;
  if (!dbPromise) {
    dbPromise = openDB<SyncDB>('terracrm-sync', 1, {
      upgrade(db) {
        const store = db.createObjectStore('metrics_queue', { keyPath: 'id' });
        store.createIndex('by-tenant', 'tenantSlug');
      },
    });
  }
  return dbPromise;
};

export const syncQueue = {
  async add(record: Omit<SyncDB['metrics_queue']['value'], 'id' | 'status'>) {
    const db = await getDB();
    if (!db) return;
    
    const id = crypto.randomUUID();
    await db.put('metrics_queue', {
      ...record,
      id,
      status: 'pending',
    });
    return id;
  },

  async getAllPending(tenantSlug: string) {
    const db = await getDB();
    if (!db) return [];
    
    // Obtenemos solo los del tenant actual para evitar fugas si cambian de cuenta
    const tx = db.transaction('metrics_queue', 'readonly');
    const index = tx.store.index('by-tenant');
    const records = await index.getAll(tenantSlug);
    return records.filter(r => r.status === 'pending' || r.status === 'error');
  },

  async remove(id: string) {
    const db = await getDB();
    if (!db) return;
    await db.delete('metrics_queue', id);
  },

  async markSyncing(id: string) {
    const db = await getDB();
    if (!db) return;
    const record = await db.get('metrics_queue', id);
    if (record) {
      record.status = 'syncing';
      await db.put('metrics_queue', record);
    }
  }
};
