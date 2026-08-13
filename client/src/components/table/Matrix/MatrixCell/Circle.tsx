import { CircleInfo } from "../type";

const COLORS = {
  border: "#d1d5db", // gray-300
  bench: "#9ca3af",
  starter: "#2563eb", // blue-600
  substitute: "#f472b6", // pink-500
};

const SIZE = {
  circle: 20,
  square: 16,
};

const circleStyle = {
  width: SIZE.circle,
  height: SIZE.circle,
  borderRadius: "50%",
  border: `2px solid ${COLORS.border}`,
};

export const Circle = ({
  is_backup,
  is_training_partner,
  calledUp,
  match,
  playerAppearance,
}: CircleInfo) => {
  // 招集外
  if (!calledUp) {
    return (
      <div
        style={{
          width: SIZE.circle,
          height: SIZE.circle,
        }}
      />
    );
  }

  // バックアップ
  if (is_backup) {
    return (
      <div
        style={{
          ...circleStyle,
          transform: "rotate(45deg)",
          background: "white",
        }}
      />
    );
  }

  // トレーニングパートナー
  if (is_training_partner) {
    return (
      <div
        style={{
          width: SIZE.square,
          height: SIZE.square,
          border: `2px solid ${COLORS.border}`,
          background: "white",
        }}
      />
    );
  }

  // 招集のみ（試合登録なし）
  if (!playerAppearance || !match) {
    return (
      <div
        style={{
          ...circleStyle,
          background: "white",
        }}
      />
    );
  }

  // ベンチ
  if (playerAppearance.play_status === "ベンチ") {
    return (
      <div
        style={{
          ...circleStyle,
          background: `${COLORS.bench}`,
        }}
      />
    );
  }

  // 出場
  const { time, play_status } = playerAppearance;
  const { play_time } = match;

  const ratio = time ? Math.min(time / (play_time ?? 90), 1) : 0;
  const color = play_status === "サブ" ? COLORS.substitute : COLORS.starter;

  return (
    <div
      style={{
        ...circleStyle,
        background: `conic-gradient(
      ${color} ${ratio * 360}deg,
      white 0deg
    )`,
      }}
    />
  );
};
