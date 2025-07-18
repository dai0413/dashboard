import { Team, TeamGet } from "../../../types/models/team";

// ジャンル名の日本語ラベルマップ
const GenreLabelMap: Record<string, string> = {
  academy: "アカデミー",
  club: "クラブ",
  college: "大学",
  high_school: "高校",
  second_team: "セカンド",
  third_team: "サード",
  youth: "ユース",
};

export const ReverseGenreLabelMap: Record<string, string> = Object.fromEntries(
  Object.entries(GenreLabelMap).map(([key, value]) => [value, key])
);

export const team = (t: Team): TeamGet => {
  return {
    ...t,
    genre: t.genre ? GenreLabelMap[t.genre] : "",
  };
};
