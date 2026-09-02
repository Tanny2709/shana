export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg font-bold text-white"
      style={{
        width: size,
        height: size,
        background: "var(--landing-gradient)",
        fontSize: size * 0.5,
      }}
      aria-hidden
    >
      S
    </div>
  );
}
