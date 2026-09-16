import { positionBase } from "../../components/formation/positionBase";
import { APP_ROUTES } from "../../lib/appRoutes";
import { FormationItem } from "../../types/formation";
import { PlayerAppearanceGet } from "../../types/models/player-appearance";

const isFormationItem = (data: unknown): data is FormationItem => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const value = data as Record<string, unknown>;

  return "position" in value && "label" in value;
};

const isPlayerAppearanceGet = (data: unknown): data is PlayerAppearanceGet => {
  if (!data || typeof data !== "object") {
    return false;
  }

  const value = data as Record<string, unknown>;

  return "position" in value && "number" in value && "player" in value;
};

export const convertToFormationItem = <T>(datas: T[]): FormationItem[] => {
  if (datas.every(isFormationItem)) {
    return datas as FormationItem[];
  }

  if (!datas.every(isPlayerAppearanceGet)) {
    console.error("PlayerAppearanceGet[] or FormationItem[] is required.");
    return [];
  }

  const formationDatas = datas.map((d) => d as PlayerAppearanceGet);

  return formationDatas.map((p) => ({
    position: p.position as keyof typeof positionBase,
    centerText: p.number,
    label: p.player?.label,
    link: p.player?.id
      ? `${APP_ROUTES.PLAYER_SUMMARY}/${p.player.id}`
      : undefined,
    tooltip: [
      { text: p.player?.label ?? "", bold: true },
      { text: `背番号 ${p.number}` },
    ],
  }));
};
