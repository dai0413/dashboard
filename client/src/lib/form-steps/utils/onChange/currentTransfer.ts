import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readItemsBase, ResBody } from "../../../api/readItems";
import { Transfer } from "../../../../types/models/transfer";
import { API_ROUTES } from "../../../apiRoutes";
import { convert } from "../../../convert/DBtoGetted";
import { position } from "../../../../utils/createOption/Enum/position";

const positionOptions = position();
type Position = (typeof positionOptions)[number] | null;

type Response = {
  to_team?: { label: any; key: string };
  to_team_name?: string;
  position?: Position[];
};

type CurrentTransfer<T extends ModelType> = {
  formData: FormTypeMap[T];
  api: AxiosInstance;
  from_date?: string;
  form?: string;
};

export const currentTransfer = async <T extends ModelType>({
  formData,
  api,
  from_date,
  form,
}: CurrentTransfer<T>): Promise<Response> => {
  if (!("player" in formData) || !formData.player) return {};

  let response: Response = {};

  const params = {
    player: formData.player,
    sort: "-from_date",
    limit: 1,
    ...(from_date !== undefined && { from_date: `<=${from_date}` }),
    ...(form !== undefined && { form }),
  };

  const currentTransfer: ResBody<Transfer> = await readItemsBase({
    apiInstance: api,
    backendRoute: API_ROUTES.TRANSFER.GET_ALL,
    params,
    returnResponse: true,
  });

  if (currentTransfer.data.length > 0) {
    const latest = convert(ModelType.TRANSFER, currentTransfer.data[0]);

    if (latest.to_team) {
      if (latest.to_team.id) {
        response.to_team = {
          label: latest.to_team.label,
          key: latest.to_team.id,
        };
      } else {
        response.to_team_name = latest.to_team.label;
      }
    }

    if (latest.position) {
      response.position = latest.position;
    }
  }

  return response;
};
