import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.STAFF_MATCH_EVENT_LOG;
const backendRoute = API_PATHS.STAFF_MATCH_EVENT_LOG;

const {
  useMetaCrud: useStaffMatchEventLog,
  MetaCrudProvider: StaffMatchEventLogProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useStaffMatchEventLog, StaffMatchEventLogProvider };
