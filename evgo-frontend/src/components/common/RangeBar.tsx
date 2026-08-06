interface RangeBarProps {
  /** 0-100 */
  percent: number;
  segments?: number;
  warnBelow?: number;
}

// Signature UI motif: a segmented instrument-style bar reused for battery
// range, route-distance-vs-range coverage, and station slot availability.
export default function RangeBar({ percent, segments = 12, warnBelow = 25 }: RangeBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  const filledCount = Math.round((clamped / 100) * segments);
  const isWarn = clamped <= warnBelow;

  return (
    <div className="range-bar" role="img" aria-label={`${Math.round(clamped)}% range`}>
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className={`seg ${i < filledCount ? `filled${isWarn ? ' warn' : ''}` : ''}`}
        />
      ))}
    </div>
  );
}
