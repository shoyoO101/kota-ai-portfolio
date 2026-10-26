import type { CSSProperties } from "react";

/** A functional clock glyph, separate from the supplied pineapple artwork. */
export function ClockIcon({ hour = 3, ticking = false }: { hour?: number; ticking?: boolean }) {
  return (
    <svg
      className={`clock-icon${ticking ? " clock-ticking" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      style={{ "--clock-hour": `${(hour % 12) * 30}deg` } as CSSProperties}
    >
      {ticking && <circle cx="12" cy="12" r="9" />}
      <path className="clock-hour" d="M12 12V7.5" />
      <path className="clock-minute" d="M12 12V5" />
      <circle cx="12" cy="12" r=".7" fill="currentColor" stroke="none" />
    </svg>
  );
}
