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

export const area = () => AreaOptions.map((a) => ({ key: a, label: a }));
