import {
  ResolveInput,
  ResolveOutput,
} from "@dai0413/myorg-shared/types/resolver/refereeAppearance";
import { Select } from "@dai0413/myorg-shared";
import { RefereeModel } from "src/models/referee.js";

type ResolveData = ResolveInput<{
  referee: Select.MODEL;
}>;

export const refereeAppearance = async (data: ResolveData[]) => {
  const newData: Partial<ResolveOutput>[] = await Promise.all(
    data.map(async (d) => {
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
