export type TableHeader = {
  label: string;
  field: string;
  getData?: (data: any) => string | Label;
  width?: string;
};

export type Label = {
  label: string;
  id?: string;
};

export type LinkField = {
  field: string;
  to: string;
};

export type FieldListData = Record<
  string,
  {
    value: any;
    onEdit?: () => void;
  }
>;
