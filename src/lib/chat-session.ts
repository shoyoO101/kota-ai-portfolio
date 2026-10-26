import { useSyncExternalStore } from "react";

export type ChatMessage = { id: string; role: "bot" | "user"; text: string; error?: boolean };
export type ChatSnapshot = {
  sessionId: string;
  messages: ChatMessage[];
  pending: boolean;
  pendingSince: number | null;
};
type Store = { snapshot: ChatSnapshot; listeners: Set<() => void> };
export const CHAT_SESSION_KEY = "kota-ai-product-advisor";
const stores = new Map<string, Store>();
const emptySnapshot: ChatSnapshot = {
  sessionId: "",
  messages: [],
  pending: false,
  pendingSince: null,
};

export function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
function getStore(key: string): Store {
  let store = stores.get(key);
  if (!store) {
    store = {
      snapshot: { sessionId: newId(), messages: [], pending: false, pendingSince: null },
      listeners: new Set(),
    };
    stores.set(key, store);
  }
  return store;
}
function update(key: string, next: Partial<ChatSnapshot>) {
  const store = getStore(key);
  store.snapshot = { ...store.snapshot, ...next };
  store.listeners.forEach((listener) => listener());
}
export function getSessionId(key = CHAT_SESSION_KEY) {
  return getStore(key).snapshot.sessionId;
}
export function getChatSnapshot(key = CHAT_SESSION_KEY) {
  return getStore(key).snapshot;
}
export function beginChatMessage(text: string, key = CHAT_SESSION_KEY) {
  const store = getStore(key);
  if (store.snapshot.pending) return false;
  update(key, {
    pending: true,
    pendingSince: Date.now(),
    messages: [...store.snapshot.messages, { id: newId(), role: "user", text }],
  });
  return true;
}
export function finishChatMessage(text: string, error = false, key = CHAT_SESSION_KEY) {
  const store = getStore(key);
  update(key, {
    pending: false,
    pendingSince: null,
    messages: [...store.snapshot.messages, { id: newId(), role: "bot", text, error }],
  });
}
export function useChatSession(key = CHAT_SESSION_KEY) {
  return useSyncExternalStore(
    (listener) => {
      const store = getStore(key);
      store.listeners.add(listener);
      return () => {
        store.listeners.delete(listener);
      };
    },
    () => getStore(key).snapshot,
    () => emptySnapshot,
  );
}
