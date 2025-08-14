import { OptionArray } from "../../types/option";

const SubConfederationOptions = [
  "CAFA",
  "UNAF",
  "COSAFA",
  "CFU",
  "AFF",
  "WAFF",
  "SAFF",
  "UNCAF",
  "WAFU",
  "CECAFA",
  "UNIFFAC",
  "NAFU",
  "EAFF",
];

export const subConfederation = (): OptionArray =>
  SubConfederationOptions.map((a) => ({ key: a, label: a }));
