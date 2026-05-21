import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../../types/models";
import { readItemBase, readItemsBase } from "../../../../api";
import { convert } from "../../../../convert/DBtoGetted";
import { OnChange } from "../../../../../types/form/onChange";
import {
  StaffRegistrationHistory,
  StaffRegistrationHistoryForm,
} from "../../../../../types/models/staff-registration-history";
import { set } from "lodash";
import { Staff } from "../../../../../types/models/staff";

export const onChangeFillChangesByRegistrationType: OnChange<
  StaffRegistrationHistoryForm,
  false
> = async ({ formData, formLabel, api }) => {
  if (!formData.staff || !api) return { formData, formLabel };

  let returnValue: Partial<StaffRegistrationHistoryForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (formData.registration_type === "register") {
    // name, en_name の設定
    const item = await readItemBase<Staff>({
      apiInstance: api,
      backendRoute: API_PATHS.STAFF.DETAIL(formData.staff),
    });

    if (!item) return { formData, formLabel };
    const { name, en_name } = convert(ModelType.STAFF, item);

    if (name) {
      returnValue = set(returnValue, "changes.name", name);
      returnFormLabel["changes.name"] = name;
    }

    if (en_name) {
      returnValue = set(returnValue, "changes.en_name", en_name);
      returnFormLabel["changes.en_name"] = en_name;
    }
  }

  if (formData.registration_type === "deregister") {
    if (!formData.season || !formData.team) return { formData, formLabel };
    const obj = await readItemsBase<StaffRegistrationHistory[]>({
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
    });

    if (!obj) return { formData, formLabel };
    if (obj.data.length === 0) return { formData, formLabel };

    const { changes } = convert(
      ModelType.STAFF_REGISTRATION_HISTORY,
      obj.data[0],
    );

    function flattenChanges(changes: Record<string, any>) {
      return Object.entries(changes).map(([key, value]) => ({
        key: `changes.${key}`,
        value,
      }));
    }

    if (changes) {
      const flattedChanges = flattenChanges(changes);
      flattedChanges.forEach((change) => {
        returnValue = set(returnValue, change.key, change.value);
        returnFormLabel[change.key] = change.value;
      });
    }
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
