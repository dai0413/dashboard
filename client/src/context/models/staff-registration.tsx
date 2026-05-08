import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/model/createModelContext";

const ContextModelString = ModelType.STAFF_REGISTRATION;
const backendRoute = API_PATHS.STAFF_REGISTRATION;

const {
  useMetaCrud: useStaffRegistration,
  MetaCrudProvider: StaffRegistrationProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useStaffRegistration, StaffRegistrationProvider };
