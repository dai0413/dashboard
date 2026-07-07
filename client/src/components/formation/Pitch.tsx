export const Pitch = () => {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-auto">
      {/* 芝 */}
      <rect x="0" y="0" width="100" height="100" fill="white" />

      {/* 外枠 */}
      <rect
        x="1"
        y="1"
        width="98"
        height="98"
        fill="none"
        stroke="black"
        strokeWidth="0.5"
      />

      {/* ハーフライン */}
      <line x1="1" y1="1" x2="99" y2="1" stroke="black" strokeWidth="0.5" />

      {/* センターサークル（下半分） */}
      <path
        d="M40 1 A10 10 0 0 0 60 1"
        fill="none"
        stroke="black"
        strokeWidth="0.5"
      />

      {/* ペナルティアーク */}
      <defs>
        <clipPath id="penaltyArc">
          <rect x="0" y="0" width="100" height="82" />
        </clipPath>
      </defs>

      <circle
        cx="50"
        cy="87"
        r="9"
        fill="none"
        stroke="black"
        strokeWidth="0.5"
        clipPath="url(#penaltyArc)"
      />

      {/* PKマーク */}
      <circle cx="50" cy="87" r="0.6" fill="black" />

      {/* ペナルティエリア */}
      <rect
        x="20"
        y="82"
        width="60"
        height="17"
        fill="none"
        stroke="black"
        strokeWidth="0.5"
      />
      {/* ゴールエリア */}
      <rect
        x="35"
        y="92"
        width="30"
        height="7"
        fill="none"
        stroke="black"
        strokeWidth="0.5"
      />
    </svg>
  );
};
