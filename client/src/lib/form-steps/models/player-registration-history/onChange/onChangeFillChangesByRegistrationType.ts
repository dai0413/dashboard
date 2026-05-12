import { API_PATHS } from "@dai0413/myorg-shared";
import { ModelType } from "../../../../../types/models";
import { readItemBase, readItemsBase } from "../../../../api";
import { convert } from "../../../../convert/DBtoGetted";
import { PlayerRegistrationHistoryForm } from "../../../../../types/models/player-registration-history";
import { OnChange } from "../../../../../types/form/onChange";
import { set } from "lodash";
import { Player } from "../../../../../types/models/player";

export const onChangeFillChangesByRegistrationType: OnChange<
  PlayerRegistrationHistoryForm
> = async (formData, formLabel, api?) => {
  if (!formData.player || !api) return { formData, formLabel };

  let returnValue: Partial<PlayerRegistrationHistoryForm> = {};
  let returnFormLabel: Record<string, any> = {};

  if (formData.registration_type === "register") {
    // name, en_name の設定
    const item = await readItemBase<Player>({
      apiInstance: api,
      backendRoute: API_PATHS.PLAYER.DETAIL(formData.player),
      returnResponse: true,
    });

    if (!item) return { formData, formLabel };

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
    const res = await readItemsBase({
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
      returnResponse: true,
    });

    if (!res) return { formData, formLabel };
    if (res.data.length === 0) return { formData, formLabel };

    const { changes } = convert(
      ModelType.PLAYER_REGISTRATION_HISTORY,
      res.data[0],
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
