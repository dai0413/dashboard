import { FormStep } from "../../types/form";
import {
  FormOptions,
  Player,
  PositionOptions,
  Team,
  TransferForm,
} from "../../types/models";

export const createTransferFormSteps = (
  players: Player[],
  teams: Team[]
): FormStep<TransferForm>[] => [
  {
    stepLabel: "選手を選択",
    type: "form",
    fields: [
      {
        key: "player",
        label: "選手",
        type: "select",
        options: players.map((player) => ({
          label: player.name || player.en_name || "不明",
          key: player._id,
        })),
      },
    ],
    validation: (formData) => !!formData.player || "選手を選択してください",
  },
  {
    stepLabel: "移籍元・先を選択",
    type: "form",
    fields: [
      {
        key: "from_team",
        label: "移籍元",
        type: "select",
        options: teams.map((team) => ({ label: team.abbr, key: team._id })),
      },
      {
        key: "to_team",
        label: "移籍先",
        type: "select",
        options: teams.map((team) => ({ label: team.abbr, key: team._id })),
      },
    ],
  },
  {
    stepLabel: "日付を入力",
    type: "form",
    fields: [
      { key: "doa", label: "移籍発表日", type: "date" },
      { key: "from_date", label: "新チーム加入日", type: "date" },
      { key: "to_date", label: "新チーム満了予定日", type: "date" },
    ],
  },
  {
    stepLabel: "移籍形態・背番号・ポジションを入力",
    type: "form",
    fields: [
      {
        key: "form",
        label: "移籍形態",
        type: "select",
        options: FormOptions.map((op) => ({ label: op, key: op })),
      },
      { key: "number", label: "背番号", type: "number" },
      {
        key: "position",
        label: "ポジション",
        type: "select",
        options: PositionOptions.map((op) => ({ label: op, key: op })),
      },
    ],
  },
  {
    stepLabel: "公式発表のURLを入力",
    type: "form",
    fields: [{ key: "URL", label: "URL", type: "multiurl" }],
  },
];
