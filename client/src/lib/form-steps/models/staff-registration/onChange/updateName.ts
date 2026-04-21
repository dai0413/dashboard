import { API_PATHS } from "@dai0413/myorg-shared";
import { OnChange } from "../../../../../types/form/onChange";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { readItemBase } from "../../../../api";
import { convert } from "../../../../convert/DBtoGetted";
import { FormUpdatePair } from "../../../../../types/form";

export const updateName: OnChange<
  FormTypeMap[ModelType.STAFF_REGISTRATION]
> = async (data, api) => {
  const staffId = data.staff;

  if (!staffId || !api) return [];

  const res = await readItemBase({
    apiInstance: api,
    backendRoute: API_PATHS.STAFF.DETAIL(staffId),
    returnResponse: true,
  });

  if (!res?.data) return [];

  const { name, en_name } = convert(ModelType.STAFF, res.data);

  const updates: FormUpdatePair = [];

  if (name) updates.push({ key: "name", value: name });
  if (en_name) updates.push({ key: "en_name", value: en_name });

  return updates;
};
