import {
  Label,
  RefereeAppearancePopulatedSchema,
  RefereeAppearancePopulateLabelSchema,
} from "@dai0413/myorg-shared";

import z from "zod";

export type ResolveInput = Omit<
  Partial<z.infer<typeof RefereeAppearancePopulatedSchema>>,
  "match"
> & {
  match: Label;
};
export type ResolveOutput = Partial<
  z.infer<typeof RefereeAppearancePopulateLabelSchema>
>;
