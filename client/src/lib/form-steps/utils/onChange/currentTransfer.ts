import { AxiosInstance } from "axios";
import { FormTypeMap, ModelType } from "../../../../types/models";
import { readItemsBase } from "../../../api/readItems";
import { Transfer } from "../../../../types/models/transfer";
import { convert } from "../../../convert/DBtoGetted";
import { API_PATHS, form, position } from "@dai0413/myorg-shared";
import { ResBody } from "@dai0413/myorg-shared";

const positionOptions = position().map((item) => item.key);
const formOptions = form().map((item) => item.key);
type Position = (typeof positionOptions)[number] | null;
type Form = (typeof formOptions)[number] | null;

type Response = {
  from_team?: { label: any; key: string };
  from_team_name?: string;
  to_team?: { label: any; key: string };
  to_team_name?: string;
  position?: Position[];
  form?: Form;
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
    sort: "-from_date,-_id",
    limit: 1,
    ...(from_date !== undefined && { from_date: `<=${from_date}` }),
    ...(form !== undefined && { form }),
  };

  const currentTransferData = await readItemsBase({
    apiInstance: api,
    backendRoute: API_PATHS.TRANSFER.ROOT,
    params,
    returnResponse: true,
  });

  if (!currentTransferData) return {};

  const currentTransfer: ResBody<Transfer[]> = currentTransferData;

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

    if (latest.from_team) {
      if (latest.from_team.id) {
        response.from_team = {
          label: latest.from_team.label,
          key: latest.from_team.id,
        };
      } else {
        response.from_team_name = latest.from_team.label;
      }
    }

    if (latest.position) {
      response.position = latest.position;
    }

    if (latest.form) {
      response.form = latest.form;
    }
  }

  return response;
};
