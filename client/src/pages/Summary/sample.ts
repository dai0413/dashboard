import { positionBase } from "../../components/formation/positionBase";
import { FormationItem } from "../../types/formation";

const positionCounts: Record<keyof typeof positionBase, number> = {
  GK: 18,

  CB: 42,
  RCB: 16,
  LCB: 14,

  RSB: 11,
  LSB: 9,

  RWB: 7,
  LWB: 6,

  DM: 15,

  RCM: 12,
  LCM: 10,

  OM: 13,

  RIH: 6,
  LIH: 5,

  RWG: 8,
  LWG: 7,

  RSH: 4,
  LSH: 3,

  CF: 20,
  RCF: 9,
  LCF: 8,

  RST: 6,
  LST: 5,
};

export const positionDatas: FormationItem[] = Object.entries(
  positionCounts,
).map(([position, count]) => ({
  position: position as keyof typeof positionBase,
  centerText: count,
  label: position,
  size: 24 + (count / 42) * 28,
  color: positionBase[position as keyof typeof positionBase].color,
  tooltip: [
    { text: position, bold: true },
    { text: `${count}試合` },
    { text: `${count * 80}分` },
  ],
}));
