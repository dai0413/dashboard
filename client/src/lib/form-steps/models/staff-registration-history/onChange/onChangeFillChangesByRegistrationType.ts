import { API_PATHS } from "@dai0413/myorg-shared";
import { FormUpdatePair } from "../../../../../types/form";
import { FormTypeMap, ModelType } from "../../../../../types/models";
import { readItemBase, readItemsBase } from "../../../../api";
import { convert } from "../../../../convert/DBtoGetted";
import { AxiosInstance } from "axios";

export const onChangeFillChangesByRegistrationType = async (
  formData: FormTypeMap[ModelType.STAFF_REGISTRATION_HISTORY],
  api: AxiosInstance,
) => {
  let obj: FormUpdatePair = [];
  if (!formData.staff) return [];
  if (formData.registration_type === "register") {
    // name, en_name の設定
    const res = await readItemBase({
      apiInstance: api,
      backendRoute: API_PATHS.STAFF.DETAIL(formData.staff),
      returnResponse: true,
    });

    const { name, en_name } = convert(ModelType.STAFF, res.data);

    if (name) {
      obj.push({
        key: "changes.name",
        value: name,
      });
    }

    if (en_name) {
      obj.push({
        key: "changes.en_name",
        value: en_name,
      });
    }
  }

  if (formData.registration_type === "deregister") {
    if (!formData.season || !formData.team) return [];
    const res = await readItemsBase({
      apiInstance: api,
      backendRoute: API_PATHS.STAFF_REGISTRATION_HISTORY.ROOT,
      params: {
        limit: 1,
        sort: "date",
        season: formData.season,
        team: formData.team,
        staff: formData.staff,
        registration_type: "register",
      },
      returnResponse: true,
    });

    if (!res) return [];
    if (res.data.length === 0) return [];

    const { changes } = convert(
      ModelType.STAFF_REGISTRATION_HISTORY,
      res.data[0],
    );

    function flattenChanges(changes: Record<string, any>) {
      return Object.entries(changes).map(([key, value]) => ({
        key: `changes.${key}`,
        value,
      }));
    }

    if (changes) {
      const result = flattenChanges(changes);
      obj.push(...result);
    }
  }

  return obj;
};
