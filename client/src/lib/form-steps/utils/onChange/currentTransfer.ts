import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readItemsBase, ResBody } from "../../../api/readItems";
import { Transfer } from "../../../../types/models/transfer";
import { API_ROUTES } from "../../../apiRoutes";
import { convert } from "../../../convert/DBtoGetted";

export const currentTransfer = async <T extends ModelType>(
  formData: FormTypeMap[T],
  api: AxiosInstance
): Promise<{ label: any; key: string } | string | null> => {
  if (!("player" in formData) || !formData.player) return null;

  const currentTransfer: ResBody<Transfer> = await readItemsBase({
    apiInstance: api,
    backendRoute: API_ROUTES.TRANSFER.GET_ALL,
    params: { player: formData.player, sort: "-from_date", limit: 1 },
    returnResponse: true,
  });

  if (currentTransfer.data.length > 0) {
    const latest = convert(ModelType.TRANSFER, currentTransfer.data[0]);

    if (latest.to_team) {
      if (latest.to_team.id) {
        return { label: latest.to_team.label, key: latest.to_team.id };
      } else {
        return latest.to_team.label;
      }
    }
  }

  return null;
};
