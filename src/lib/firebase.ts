import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with Database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: 'anonymous'
    },
    operationType,
    path
  };
  console.error('Firestore Sync Error: ', JSON.stringify(errInfo));
  // Note: We log the error but avoid throwing a hard exception to prevent crashing the React rendering thread, allowing graceful fallback state.
}

// Connection check
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firebase connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration or internet connection.");
    }
  }
}

testConnection();

/**
 * Recursively removes undefined properties from an object/array so Firestore doesn't fail on write.
 */
export function sanitizeData<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return (obj === undefined ? null : obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeData(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const result: any = {};
    Object.keys(obj).forEach(key => {
      const val = (obj as any)[key];
      if (val !== undefined) {
        result[key] = sanitizeData(val);
      }
    });
    return result as T;
  }
  return obj;
}

