import { ModelType } from "../../types/models";
import { API_PATHS } from "@dai0413/myorg-shared";
import { createModelContext } from "../../utils/createModelContext";

const ContextModelString = ModelType.STAFF;
const backendRoute = API_PATHS.STAFF;

const { useMetaCrud: useStaff, MetaCrudProvider: StaffProvider } =
  createModelContext(ContextModelString, backendRoute);

export { useStaff, StaffProvider };
