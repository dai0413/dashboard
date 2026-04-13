export enum StepType {
  FORM = "form",
  CONFIRM = "confirm",
}

export enum DataSource {
  META_DATA = "meta_data",
  BULK_COMMON = "bulk_common",
}

export type FormUpdatePair = {
  key: string;
  value: any;
}[];
