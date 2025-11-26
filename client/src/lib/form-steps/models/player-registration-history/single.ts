import { FilterableFieldDefinition } from "@myorg/shared";
import { FormStep, FormUpdatePair } from "../../../../types/form";
import { ModelType } from "../../../../types/models";
import { TeamCompetitionSeason } from "../../../../types/models/team-competition-season";
import { readItemBase, readItemsBase } from "../../../api";
import { convert } from "../../../convert/DBtoGetted";
import { PlayerRegistration } from "../../../../types/models/player-registration";
import { API_PATHS } from "../../../api-paths";

export const playerRegistrationHistory: FormStep<ModelType.PLAYER_REGISTRATION_HISTORY>[] =
  [
    {
      stepLabel: "登録or抹消を入力",
      type: "form",
      fields: [
        {
          key: "date",
          label: "日付",
          fieldType: "input",
          valueType: "date",
        },
        {
          key: "registration_type",
          label: "登録・抹消",
          fieldType: "select",
          valueType: "option",
          required: true,
        },
      ],
    },
    {
      stepLabel: "大会シーズン選択",
      type: "form",
      fields: [
        {
          key: "season",
          label: "大会シーズン",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
      filterConditions: async (formData, api) => {
        if (!formData.season) return [];

        const resBody = await readItemsBase({
          apiInstance: api,
          params: { getAll: true, season: formData.season },
          backendRoute: API_PATHS.TEAM_COMPETITION_SEASON.ROOT,
          returnResponse: true,
        });

        const teamCompetitionSeason = convert(
          ModelType.TEAM_COMPETITION_SEASON,
          resBody.data as TeamCompetitionSeason[]
        );

        const teams = teamCompetitionSeason.map((t) => t.team);
        const filterCondition: FilterableFieldDefinition = {
          key: "_id",
          label: "チーム",
          operator: "equals",
          type: "select",
          value: teams
            .map((t) => t.id)
            .filter((id): id is string => Boolean(id)),
          valueLabel: teams.map((t) => t.label),
        };

        return [filterCondition];
      },
    },
    {
      stepLabel: "チーム選択",

      type: "form",
      fields: [
        {
          key: "team",
          label: "チーム",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
      filterConditions: async (formData, api) => {
        if (!formData.team || !formData.season) return [];

        if (
          formData.registration_type === "deregister" ||
          formData.registration_type === "change"
        ) {
          const resBody = await readItemsBase({
            apiInstance: api,
            params: {
              getAll: true,
              team: formData.team,
              season: formData.season,
            },
            backendRoute: API_PATHS.PLAYER_REGISTRATION.ROOT,
            returnResponse: true,
          });

          const playerRegistration = convert(
            ModelType.PLAYER_REGISTRATION,
            resBody.data as PlayerRegistration[]
          );

          const players = playerRegistration.map((t) => t.player);
          const filterCondition: FilterableFieldDefinition = {
            key: "_id",
            label: "選手",
            operator: "equals",
            type: "select",
            value: players
              .map((t) => t.id)
              .filter((id): id is string => Boolean(id)),
            valueLabel: players.map((t) => t.label),
          };

          return [filterCondition];
        }
        return [];
      },
    },
    {
      stepLabel: "選手選択",
      type: "form",
      fields: [
        {
          key: "player",
          label: "選手",
          fieldType: "table",
          valueType: "option",
          required: true,
        },
      ],
      onChange: async (formData, api) => {
        let obj: FormUpdatePair = [];
        if (!formData.player) return [];
        if (formData.registration_type === "register") {
          // name, en_name の設定
          const res = await readItemBase({
            apiInstance: api,
            backendRoute: API_PATHS.PLAYER.DETAIL(formData.player),
            returnResponse: true,
          });

          const { name, en_name } = convert(ModelType.PLAYER, res.data);

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

          const { changes } = convert(
            ModelType.PLAYER_REGISTRATION_HISTORY,
            res.data[0]
          );

          function flattenChanges(changes: Record<string, any>) {
            return Object.entries(changes).map(([key, value]) => ({
              key: `changes.${key}`,
              value,
            }));
          }

          if (changes) {
            const result = flattenChanges(changes);
            console.log("result", result);
            obj.push(...result);
          }
        }

        return obj;
      },
    },
    {
      stepLabel: "背番号・POS.・名前・英名・身長・体重を入力",
      type: "form",
      fields: [
        {
          key: "changes.number",
          label: "背番号",
          fieldType: "input",
          valueType: "number",
        },
        {
          key: "changes.position_group",
          label: "ポジション",
          fieldType: "select",
          valueType: "option",
        },
        {
          key: "changes.name",
          label: "名前",
          fieldType: "input",
          valueType: "text",
        },
        {
          key: "changes.en_name",
          label: "英名",
          fieldType: "input",
          valueType: "text",
        },
        {
          key: "changes.height",
          label: "身長",
          fieldType: "input",
          valueType: "number",
        },
        {
          key: "changes.weight",
          label: "体重",
          fieldType: "input",
          valueType: "number",
        },
        {
          key: "changes.isTypeTwo",
          label: "2種登録",
          fieldType: "input",
          valueType: "boolean",
        },
        {
          key: "changes.isSpecialDesignation",
          label: "特別指定",
          fieldType: "input",
          valueType: "boolean",
        },
        {
          key: "changes.homegrown",
          label: "ホームグロウン",
          fieldType: "input",
          valueType: "boolean",
        },
        {
          key: "changes.note",
          label: "メモ",
          fieldType: "input",
          valueType: "text",
        },
      ],
      validate: (formData) => {
        if (formData.registration_type === "register") {
          if (!formData.changes?.name) {
            return {
              success: false,
              message: "名前は必須です",
            };
          }
        } else if (formData.registration_type === "change") {
          if (!formData.changes) {
            return {
              success: false,
              message: "変更点がありません",
            };
          }
        }

        return {
          success: true,
        };
      },
      skip: (data) => {
        return data.registration_type === "deregister";
      },
    },
  ];
