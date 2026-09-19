export default function Avatar({
  avatarUrl,
  fullName,
  size = 44,
}: {
  avatarUrl?: string | null;
  fullName?: string | null;
  size?: number;
}) {
  return (
    <div
      style={{ height: size, width: size }}
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-surface-2 to-border font-bold text-foreground"
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={fullName ?? ""} className="h-full w-full object-cover" />
      ) : (
        fullName?.[0]?.toUpperCase() ?? "?"
      )}
    </div>
  );
}
