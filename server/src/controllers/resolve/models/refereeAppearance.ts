import {
  Label,
  RefereeAppearancePopulatedSchema,
  RefereeAppearancePopulateLabelSchema,
} from "@dai0413/myorg-shared";

import z from "zod";
import { RefereeModel } from "src/models/referee.js";

type ResolveInput = Omit<
  Partial<z.infer<typeof RefereeAppearancePopulatedSchema>>,
  "match"
> & {
  match: Label;
};
type ResolveOutput = Partial<
  z.infer<typeof RefereeAppearancePopulateLabelSchema>
>;

export const refereeAppearance = async (data: ResolveInput[]) => {
  const newData: Partial<ResolveOutput>[] = await Promise.all(
    data.map(async (d) => {
      let result = d;
      const findObj = d.referee ?? {};

      const findData = await RefereeModel.find(findObj)
        .select("_id name team")
        .lean<{ _id: any }[]>();

      const refereeId =
        findData.length === 1 ? findData[0].toString() : undefined;

      const referee = refereeId
        ? {
            id: refereeId,
            label: d.referee_name ?? "",
          }
        : undefined;

      return {
        ...d,
        referee: referee,
        referee_name: referee ? undefined : d.referee?.name,
      };
    }),
  );

  return newData;
};
