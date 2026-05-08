import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/model/createModelContext";

const ContextModelString = ModelType.STAFF_REGISTRATION_HISTORY;
const backendRoute = API_PATHS.STAFF_REGISTRATION_HISTORY;

const {
  useMetaCrud: useStaffRegistrationHistory,
  MetaCrudProvider: StaffRegistrationHistoryProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useStaffRegistrationHistory, StaffRegistrationHistoryProvider };
