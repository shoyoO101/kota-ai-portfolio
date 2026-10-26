import { useRef, useState, type ReactNode } from "react";
import { ChatUIContext } from "@/hooks/use-chat-ui";
import { track, type DemoSource } from "@/lib/analytics";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const inlineInput = useRef<HTMLInputElement>(null);
  const demoTrigger = useRef<HTMLElement>(null);
  const openChat = (source: DemoSource) => {
    if (!open) track("demo_chat_opened", { source });
    setOpen(true);
  };
  return (
    <ChatUIContext.Provider value={{ open, setOpen, openChat, inlineInput, demoTrigger }}>
      {children}
    </ChatUIContext.Provider>
  );
}
