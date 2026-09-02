// Pure CSS, GPU-cheap (transform + opacity only) decorative background —
// no canvas/SVG animation. Two blurred blobs (blue, then a faint purple)
// drifting slowly behind the hero content, extremely low opacity so it
// reads as ambient lighting, not a gradient illustration.
export function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-1/4 left-1/4 h-[36rem] w-[36rem] rounded-full opacity-[0.1] blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          animation: "drift-1 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full opacity-[0.07] blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--landing-violet), transparent 70%)",
          animation: "drift-2 34s ease-in-out infinite",
        }}
      />
    </div>
  );
}
