import { OptionArray } from "../../types/option";

const levelOptions = [
  `1部`,
  `2部`,
  `3部`,
  `4部`,
  `5部`,
  `6部`,
  `リーグカップ`,
  `国内カップ戦`,
  `国内スーパーカップ`,
  `入れ替え`,
  `地域大会`,
  `地域予選`,
  `世界大会`,
];

export const level = (): OptionArray =>
  levelOptions.map((a) => ({ key: a, label: a }));
