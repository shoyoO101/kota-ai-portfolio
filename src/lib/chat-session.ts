import { useEffect, useState } from "react";

export type ChatMessage = { id: string; role: "bot" | "user"; text: string };

type Store = {
  sessionId: string;
  messages: ChatMessage[];
  listeners: Set<() => void>;
};

// In-memory only: lives for the current page load. A refresh or a new tab
// starts a brand new session; opening/closing the widget keeps it.
const stores = new Map<string, Store>();

function newId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function getStore(key: string): Store {
  let store = stores.get(key);
  if (!store) {
    store = { sessionId: newId(), messages: [], listeners: new Set() };
    stores.set(key, store);
  }
  return store;
}

export function getSessionId(key: string) {
  return getStore(key).sessionId;
}

export function setMessages(
  key: string,
  update: (prev: ChatMessage[]) => ChatMessage[],
) {
  const store = getStore(key);
  store.messages = update(store.messages);
  store.listeners.forEach((l) => l());
}

export function useChatMessages(key: string) {
  const [messages, setLocal] = useState<ChatMessage[]>(
    () => getStore(key).messages,
  );

  useEffect(() => {
    const store = getStore(key);
    const listener = () => setLocal(store.messages);
    store.listeners.add(listener);
    listener();
    return () => {
      store.listeners.delete(listener);
    };
  }, [key]);

  return messages;
}

export { newId };
