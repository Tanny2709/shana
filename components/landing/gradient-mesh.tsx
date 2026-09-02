// Pure CSS, GPU-cheap (transform + opacity only) decorative background —
// no canvas/SVG animation. Two large blurred blobs drifting slowly behind
// the hero content, low opacity so it stays understated in both themes.
export function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-1/4 left-1/4 h-[36rem] w-[36rem] rounded-full opacity-[0.15] blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          animation: "drift-1 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--success), transparent 70%)",
          animation: "drift-2 34s ease-in-out infinite",
        }}
      />
    </div>
  );
}
