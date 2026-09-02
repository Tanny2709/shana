"use client";

import { useEffect, useRef, useState } from "react";

// Fires once when the element first scrolls into view, then disconnects —
// entrance animations shouldn't re-trigger on every scroll direction change.
// `rootMargin` expands the trigger zone below the viewport (default 200px)
// so content has already finished revealing by the time it's actually
// visible, instead of popping in right at the viewport edge.
export function useInView<T extends HTMLElement>(threshold = 0.2, rootMargin = "0px 0px 200px 0px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      // No observer support: fail open (treat as visible) rather than
      // never firing the entrance animation at all.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
