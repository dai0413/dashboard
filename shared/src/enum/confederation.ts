const ConfederationOptions = [
  "AFC",
  "UEFA",
  "CAF",
  "OFC",
  "CONCACAF",
  "CONMEBOL",
  "FSMFA",
];

export const confederation = () =>
  ConfederationOptions.map((a) => ({ key: a, label: a }));
