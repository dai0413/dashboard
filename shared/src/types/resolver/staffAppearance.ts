import {
  Label,
  StaffAppearancePopulatedSchema,
  StaffAppearancePopulateLabelSchema,
} from "@dai0413/myorg-shared";
import z from "zod";

export type ResolveInput = Omit<
  Partial<z.infer<typeof StaffAppearancePopulatedSchema>>,
  "team" | "match"
> & {
  match: Label;
  team?: Label;
  season?: string[];
};
export type ResolveOutput = Partial<
  z.infer<typeof StaffAppearancePopulateLabelSchema>
>;
