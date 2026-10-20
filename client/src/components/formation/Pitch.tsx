type PitchOptions = {
  grass?: boolean;
  outline?: boolean;
  halfLine?: boolean;
  centerCircle?: boolean;
  penaltyArc?: boolean;
  penaltyArea?: boolean;
  goalArea?: boolean;
};

type PitchProps = {
  options?: PitchOptions;
};

const DEFAULT_OPTIONS: Required<PitchOptions> = {
  grass: true,
  outline: true,
  halfLine: true,
  centerCircle: true,
  penaltyArc: true,
  penaltyArea: true,
  goalArea: true,
};

export const Pitch = ({ options = {} }: PitchProps) => {
  const {
    grass,
    outline,
    halfLine,
    centerCircle,
    penaltyArc,
    penaltyArea,
    goalArea,
  } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return (
    <svg viewBox="0 0 100 100" className="h-full w-auto">
      {/* 芝 */}
      {grass && <rect x="0" y="0" width="100" height="100" fill="white" />}

      {/* 外枠 */}
      {outline && (
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
        />
      )}

      {/* ハーフライン */}
      {halfLine && (
        <line x1="1" y1="1" x2="99" y2="1" stroke="black" strokeWidth="0.5" />
      )}

      {/* センターサークル（下半分） */}
      {centerCircle && (
        <path
          d="M40 1 A10 10 0 0 0 60 1"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
        />
      )}

      {/* ペナルティアーク */}
      <defs>
        <clipPath id="penaltyArc">
          <rect x="0" y="0" width="100" height="82" />
        </clipPath>
      </defs>
      {penaltyArc && (
        <circle
          cx="50"
          cy="87"
          r="9"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
          clipPath="url(#penaltyArc)"
        />
      )}

      {/* PKマーク */}
      {penaltyArea && <circle cx="50" cy="87" r="0.6" fill="black" />}

      {/* ペナルティエリア */}
      {penaltyArea && (
        <rect
          x="20"
          y="82"
          width="60"
          height="17"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
        />
      )}

      {/* ゴールエリア */}
      {goalArea && (
        <rect
          x="35"
          y="92"
          width="30"
          height="7"
          fill="none"
          stroke="black"
          strokeWidth="0.5"
        />
      )}
    </svg>
  );
};
