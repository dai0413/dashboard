import { APP_ROUTES } from "../../../lib/appRoutes";
import { ModelType } from "../../../types/models";
import { FormMode, From, InputMode } from "../../../types/types";
import { Items } from "../types";

export const d_pcItems: Items[] = [
  {
    model: "Player",
    desc: "選手",
    link: APP_ROUTES.PLAYER,
    icon: "player",
    startFormArgs: {
      modelType: ModelType.PLAYER,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_PC,
    },
  },
  {
    model: "PlayerRegistrationHistory",
    desc: "選手の登録履歴",
    link: APP_ROUTES.PLAYER_REGISTRATION_HISTORY,
    icon: "player",
    startFormArgs: {
      modelType: ModelType.PLAYER_REGISTRATION_HISTORY,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_PC,
    },
  },
];
