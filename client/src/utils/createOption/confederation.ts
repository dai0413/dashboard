import { OptionArray } from "../../types/option";

const ConfederationOptions = [
  "AFC",
  "UEFA",
  "CAF",
  "OFC",
  "CONCACAF",
  "CONMEBOL",
  "FSMFA",
];

export const confederation = (): OptionArray =>
  ConfederationOptions.map((a) => ({ key: a, label: a }));
