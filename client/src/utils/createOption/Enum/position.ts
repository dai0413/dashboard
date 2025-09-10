import { OptionArray } from "../../../types/option";

const PositionOptions = [
  "GK",
  "DF",
  "CB",
  "RCB",
  "LCB",
  "SB",
  "RSB",
  "LSB",
  "WB",
  "RWB",
  "LWB",
  "MF",
  "CM",
  "LCM",
  "RCM",
  "DM",
  "OM",
  "SH",
  "WG",
  "RIH",
  "LIH",
  "RSH",
  "LSH",
  "RWG",
  "LWG",
  "CF",
  "FW",
];
export const position = (): OptionArray =>
  PositionOptions.map((a) => ({ key: a, label: a }));
