/**
 * MorphingBlob.tsx - Animated Shape-Shifting Blob (CSS-only, zero JS overhead)
 *
 * Uses pure CSS @keyframes (morph-blob class from index.css) instead of
 * Framer Motion for continuous animations. This eliminates JS main-thread
 * work — the blob is 100% GPU-composited.
 *
 * On mobile (via .morph-blob class in index.css), the animation is disabled
 * and border-radius set to 50% for maximum performance.
 */

interface MorphingBlobProps {
  className?: string;
  color?: string;
  size?: number;
  duration?: number;
}

const MorphingBlob = ({
  className = "",
  color = "hsl(210 100% 56% / 0.08)",
  size = 400,
  duration = 20,
}: MorphingBlobProps) => {
  return (
    <div
      className={`pointer-events-none absolute morph-blob ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        filter: "blur(60px)",
        borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
        animationDuration: `${duration}s`,
      }}
    />
  );
};

export default MorphingBlob;
