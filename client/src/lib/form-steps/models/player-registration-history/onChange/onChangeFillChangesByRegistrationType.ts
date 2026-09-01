import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../../types/models";
import { readItemBase, readItemsBase } from "../../../../api";
import { convert } from "../../../../convert/DBtoGetted";
import {
  PlayerRegistrationHistory,
  PlayerRegistrationHistoryForm,
} from "../../../../../types/models/player-registration-history";
import { OnChange } from "../../../../../types/form/onChange";
import { set } from "lodash";
import { Player } from "../../../../../types/models/player";

export const onChangeFillChangesByRegistrationType: OnChange<
  PlayerRegistrationHistoryForm,
  false
> = async ({ formData, formLabel, api }) => {
  if (!formData.player || !api) return { formData, formLabel };

  let returnValue: Partial<PlayerRegistrationHistoryForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (formData.registration_type === "register") {
    // name, en_name の設定
    const item = await readItemBase<Player>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER.DETAIL(formData.player),
    });

    if (!item) return { formData, formLabel };

    returnValue = { changes: { ...formData.changes } };
    returnFormLabel = { changes: { ...formLabel.changes } };

    const { name, en_name } = convert(ModelType.PLAYER, item);

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
    const obj = await readItemsBase<PlayerRegistrationHistory[]>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER_REGISTRATION_HISTORY.ROOT,
      params: {
        limit: 1,
        sort: "date",
        season: formData.season,
        team: formData.team,
        player: formData.player,
        registration_type: "register",
      },
    });

    if (!obj) return { formData, formLabel };

    const { changes } = convert(
      ModelType.PLAYER_REGISTRATION_HISTORY,
      obj.data[0],
    );

    function flattenChanges(changes: Record<string, any>) {
      return Object.entries(changes).map(([key, value]) => ({
        key: `changes.${key}`,
        value,
      }));
    }

    if (changes) {
      returnValue = { changes: { ...formData.changes } };
      returnFormLabel = { changes: { ...formLabel.changes } };
      const flattedChanges = flattenChanges(changes);
      flattedChanges.forEach((change) => {
        returnValue = set(returnValue, change.key, change.value);
        returnFormLabel[change.key] = change.value;
      });
    }
  }

  return { formData: returnValue, formLabel: returnFormLabel };
};
