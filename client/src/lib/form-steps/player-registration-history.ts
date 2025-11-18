import { FilterableFieldDefinition } from "@myorg/shared";
import { FormStep, FormUpdatePair } from "../../types/form";
import { ModelType } from "../../types/models";
import { TeamCompetitionSeason } from "../../types/models/team-competition-season";
import { readItemBase, readItemsBase } from "../api";
import { API_ROUTES } from "../apiRoutes";
import { convert } from "../convert/DBtoGetted";
import { currentTransfer } from "./utils/onChange/currentTransfer";
import { PlayerRegistrationHistory } from "../../types/models/player-registration-history";

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
          backendRoute: API_ROUTES.TEAM_COMPETITION_SEASON.GET_ALL,
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
          editByAdmin: true,
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
            backendRoute: API_ROUTES.PLAYER_REGISTRATION.GET_ALL,
            returnResponse: true,
          });

          const playerRegistrationHistory = convert(
            ModelType.PLAYER_REGISTRATION_HISTORY,
            resBody.data as PlayerRegistrationHistory[]
          );

          const players = playerRegistrationHistory.map((t) => t.player);
          const filterCondition: FilterableFieldDefinition = {
            key: "_id",
            label: "選手",
            operator: "equals",
            type: "select",
            value: players
              .map((t) => t.id)
              .filter((id): id is string => Boolean(id)),
            valueLabel: players.map((t) => t.label),
            editByAdmin: true,
          };

          console.log("new filterCondition", filterCondition);

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
        if (
          formData.registration_type === "register" ||
          formData.registration_type === "change"
        ) {
          // name, en_name の設定
          const res = await readItemBase({
            apiInstance: api,
            backendRoute: API_ROUTES.PLAYER.DETAIL(formData.player),
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

          // teamの設定
          const { to_team } = await currentTransfer(formData, api);
          if (to_team) {
            obj.push({
              key: "team",
              value: to_team,
            });
          }
        }
        return obj;
      },
    },
    {
      stepLabel: "登録or抹消・日付・背番号・POS.・名前・英名・身長・体重を入力",
      type: "form",
      fields: [
        {
          update: true,
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
      skip: (data) => {
        return data.registration_type === "deregister";
      },
    },
  ];
