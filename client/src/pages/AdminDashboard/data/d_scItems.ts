import { APP_ROUTES } from "../../../lib/appRoutes";
import { ModelType } from "../../../types/models";
import { FormMode, From, InputMode } from "../../../types/types";
import { Items } from "../types";

export const d_scItems: Items[] = [
  {
    model: "Staff",
    desc: "スタッフ",
    link: APP_ROUTES.STAFF,
    icon: "player",
    startFormArgs: {
      modelType: ModelType.STAFF,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_SC,
    },
  },
  {
    model: "StaffRegistrationHistory",
    desc: "スタッフの登録履歴",
    link: APP_ROUTES.STAFF_REGISTRATION_HISTORY,
    icon: "player",
    startFormArgs: {
      modelType: ModelType.STAFF_REGISTRATION_HISTORY,
      inputMode: InputMode.MANY,
      formMode: FormMode.CREATE,
      from: From.D_SC,
    },
  },
];
