import { FormFieldDefinition } from "../../../../types/form";
import { ModelType } from "../../../../types/models";

type BaseModel = ModelType.COUNTRY;
type Key = FormFieldDefinition<BaseModel>["key"];

export const fieldMap: Record<Key, FormFieldDefinition<BaseModel>> = {
  name: {
    key: "name",
    label: "国名",
    fieldType: "input",
    valueType: "text",
    required: true,
  },
  en_name: {
    key: "en_name",
    label: "英名",
    fieldType: "input",
    valueType: "text",
  },
  iso3: {
    key: "iso3",
    label: "コード",
    fieldType: "input",
    valueType: "text",
  },
  fifa_code: {
    key: "fifa_code",
    label: "FIFAコード",
    fieldType: "input",
    valueType: "text",
  },
  area: {
    key: "area",
    label: "地域",
    fieldType: "select",
    valueType: "option",
  },
  district: {
    key: "district",
    label: "詳細地域",
    fieldType: "select",
    valueType: "option",
  },
  confederation: {
    key: "confederation",
    label: "地域",
    fieldType: "select",
    valueType: "option",
  },
  sub_confederation: {
    key: "sub_confederation",
    label: "詳細地域",
    fieldType: "select",
    valueType: "option",
  },
  established_year: {
    key: "established_year",
    label: "協会成立年",
    fieldType: "input",
    valueType: "number",
  },
  fifa_member_year: {
    key: "fifa_member_year",
    label: "FIFA 加入年",
    fieldType: "input",
    valueType: "number",
  },
  association_member_year: {
    key: "association_member_year",
    label: "地域協会加入年",
    fieldType: "input",
    valueType: "number",
  },
  district_member_year: {
    key: "district_member_year",
    label: "詳細地域協会加入年",
    fieldType: "input",
    valueType: "number",
  },
};

export const getFields = (keys: (keyof typeof fieldMap)[]) =>
  keys.map((key) => fieldMap[key]);
