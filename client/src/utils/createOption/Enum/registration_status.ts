import { OptionArray } from "../../../types/option";

export const registrationStatus = (): OptionArray => [
  { key: "active", label: "登録中" },
  { key: "terminated", label: "抹消済み" },
];
