import { useEffect, useRef, useState } from "react";
import { ANALYTICS } from "@/lib/analytics-config";
import { analyticsEnabled, beforeAnalyticsSend, track } from "@/lib/analytics";

export function Analytics({ pathname }: { pathname: string }) {
  const [ready, setReady] = useState(false);
  const verifyOpened = useRef(false);
  useEffect(() => {
    if (!analyticsEnabled(import.meta.env.PROD, window.location.hostname)) return;
    window.kotaAnalyticsBeforeSend = beforeAnalyticsSend;
    let script = document.querySelector<HTMLScriptElement>("#kota-analytics");
    const loaded = () => {
      if (script) script.dataset["loaded"] = "true";
      setReady(true);
    };
    if (!script) {
      script = document.createElement("script");
      script.id = "kota-analytics";
      script.src = ANALYTICS.scriptUrl;
      script.async = true;
      script.defer = true;
      script.dataset["websiteId"] = ANALYTICS.websiteId;
      script.dataset["domains"] = ANALYTICS.domains.join(",");
      script.dataset["beforeSend"] = "kotaAnalyticsBeforeSend";
      script.dataset["excludeHash"] = "true";
      script.addEventListener("load", loaded);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", loaded);
      if (script.dataset["loaded"] === "true") loaded();
    }
    // Keep one script across route changes and React effect re-runs.
    return () => script?.removeEventListener("load", loaded);
  }, []);

  useEffect(() => {
    if (pathname !== "/verify") verifyOpened.current = false;
    else if (ready && !verifyOpened.current) {
      verifyOpened.current = true;
      track("demo_chat_opened", { source: "/verify" });
    }
  }, [pathname, ready]);
  return null;
}
