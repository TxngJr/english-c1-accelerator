const DB_NAME = "english-c1-accelerator-audio";
const STORE_NAME = "recordings";
const DB_VERSION = 1;

export type StoredRecordingBlob = {
  id: string;
  blob: Blob;
};

function openDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("IndexedDB is unavailable"));
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) db.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open audio database"));
  });
}

export async function saveRecordingBlob(id: string, blob: Blob): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(blob, id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not save recording"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Recording transaction was aborted"));
    });
  } finally {
    db.close();
  }
}

export async function loadRecordingBlob(id: string): Promise<Blob | undefined> {
  const db = await openDb();
  try {
    return await new Promise<Blob | undefined>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const request = transaction.objectStore(STORE_NAME).get(id);
      request.onsuccess = () => resolve(request.result as Blob | undefined);
      request.onerror = () => reject(request.error ?? new Error("Could not load recording"));
    });
  } finally {
    db.close();
  }
}

export async function listRecordingBlobs(): Promise<StoredRecordingBlob[]> {
  const db = await openDb();
  try {
    return await new Promise<StoredRecordingBlob[]>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const keysRequest = store.getAllKeys();
      const valuesRequest = store.getAll();

      transaction.oncomplete = () => {
        const keys = keysRequest.result;
        const values = valuesRequest.result as Blob[];
        resolve(keys.map((key, index) => ({ id: String(key), blob: values[index] })));
      };
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not read recording backup data"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Recording backup transaction was aborted"));
    });
  } finally {
    db.close();
  }
}

export async function replaceRecordingBlobs(entries: StoredRecordingBlob[]): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
      for (const entry of entries) store.put(entry.blob, entry.id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not restore recording backup data"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Recording restore transaction was aborted"));
    });
  } finally {
    db.close();
  }
}

export async function clearRecordingBlobs(): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).clear();
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Could not clear recordings"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Recording clear transaction was aborted"));
    });
  } finally {
    db.close();
  }
}
