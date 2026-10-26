import { createContext, useContext, type RefObject } from "react";
import type { DemoSource } from "@/lib/analytics";
type ChatUI = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openChat: (source: DemoSource) => void;
  inlineInput: RefObject<HTMLInputElement | null>;
  demoTrigger: RefObject<HTMLElement | null>;
};
export const ChatUIContext = createContext<ChatUI | null>(null);
export function useChatUI() {
  const context = useContext(ChatUIContext);
  if (!context) throw new Error("Chat UI requires ChatProvider");
  return context;
}
