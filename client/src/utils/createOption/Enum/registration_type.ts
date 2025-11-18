import { OptionArray } from "../../../types/option";

export const registrationType = (): OptionArray => [
  { key: "register", label: "登録" },
  { key: "deregister", label: "抹消" },
  { key: "change", label: "変更" },
];
