import { staffRegistration as createConfig } from "@dai0413/myorg-shared/models-config";
import { crudFactory } from "../../utils/crudFactory.js";
import { StaffRegistrationModel as Model } from "../../models/staff-registration.js";

const config = createConfig(Model);
const { getAllItems, createItem, getItem, updateItem, deleteItem } =
  crudFactory(config);

export { getAllItems, createItem, getItem, updateItem, deleteItem };
