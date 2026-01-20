import { ModelType } from "../../types/models";

import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.STAFF_APPEARANCE;
const backendRoute = API_PATHS.STAFF_APPEARANCE;

const {
  useMetaCrud: useStaffAppearance,
  MetaCrudProvider: StaffAppearanceProvider,
} = createModelContext(ContextModelString, backendRoute);

export { useStaffAppearance, StaffAppearanceProvider };
