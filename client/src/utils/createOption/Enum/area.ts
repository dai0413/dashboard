import { OptionArray } from "../../../types/option";

const AreaOptions = [
  "アジア",
  "ヨーロッパ",
  "アフリカ",
  "オセアニア",
  "北アメリカ",
  "南極",
  "南アメリカ",
  "ミクロネシア",
];

export const area = (): OptionArray =>
  AreaOptions.map((a) => ({ key: a, label: a }));
