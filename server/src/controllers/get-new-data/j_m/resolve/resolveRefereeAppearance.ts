import {
  Form,
  Scraped,
} from "@dai0413/myorg-shared/types/j_m/referee-appearance";
import { RefereeModel } from "../../../../models/referee.js";

export const resolveRefereeAppearance = async (data: Scraped[]) => {
  const newData: Partial<Form>[] = await Promise.all(
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
