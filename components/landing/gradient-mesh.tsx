// Pure CSS, GPU-cheap (transform + opacity only) decorative background —
// no canvas/SVG animation. Three blurred, blended gradient blobs drifting
// slowly behind the hero content: two low-opacity mono-color ones for
// ambient lighting, plus a slower-moving multi-color brand-gradient one
// centered directly behind the headline for a bit more visible motion —
// still soft/blurred enough to never fight text legibility.
export function GradientMesh() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute top-1/2 left-1/2 h-[42rem] w-[42rem] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background: "var(--landing-gradient)",
          animation: "drift-3 40s linear infinite",
        }}
      />
      <div
        className="absolute -top-1/4 left-1/4 h-[36rem] w-[36rem] rounded-full opacity-[0.12] blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--accent), transparent 70%)",
          animation: "drift-1 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-1/4 right-1/4 h-[30rem] w-[30rem] rounded-full opacity-[0.09] blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--landing-violet), transparent 70%)",
          animation: "drift-2 34s ease-in-out infinite",
        }}
      />
    </div>
  );
}
