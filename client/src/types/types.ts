export type TableHeader = {
  label: string;
  field: string | ((data: any) => string);
  width?: string;
};

export type Label = {
  label: string;
  id: string;
};

export type LinkField = {
  field: string;
  to: string;
};
