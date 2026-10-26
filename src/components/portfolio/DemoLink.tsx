import { ArrowRight } from "lucide-react";
import { useChatUI } from "@/hooks/use-chat-ui";
import { COPY } from "@/lib/site-copy";
import type { DemoSource } from "@/lib/analytics";
export function DemoLink({
  className = "button button-primary",
  children = COPY.work.demo,
  source = "project_card",
}: {
  className?: string;
  children?: React.ReactNode;
  source?: DemoSource;
}) {
  const { openChat, demoTrigger } = useChatUI();
  return (
    <button
      type="button"
      className={className}
      onClick={(event) => {
        demoTrigger.current = event.currentTarget;
        openChat(source);
      }}
    >
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </button>
  );
}
