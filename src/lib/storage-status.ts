type Listener = () => void;

let currentError: string | null = null;
const listeners = new Set<Listener>();

export function subscribeStorageStatus(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStorageError(): string | null {
  return currentError;
}

export function getServerStorageError(): null {
  return null;
}

export function reportStorageError(message: string): void {
  if (currentError === message) return;
  currentError = message;
  for (const listener of listeners) listener();
}

export function clearStorageError(): void {
  if (currentError === null) return;
  currentError = null;
  for (const listener of listeners) listener();
}
