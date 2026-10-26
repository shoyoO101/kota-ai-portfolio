/** Exact supplied assets; the logo artwork is never redrawn. */
export function BrandMark({
  className = "",
  full = false,
}: {
  className?: string;
  full?: boolean;
}) {
  return (
    <img
      className={className}
      src={full ? "/pinehour-logo.png" : "/pinehour-mark.png"}
      width={full ? 1024 : 1254}
      height={full ? 1024 : 1254}
      alt=""
      aria-hidden="true"
      decoding="async"
    />
  );
}
