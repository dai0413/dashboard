export type DisplayListItem = {
  id: string;
  group?: string;
  field?: string;
  value: {
    label: string;
    to?: string;
  };
  isRed?: boolean;

  displayGroup?: boolean;
  displayField?: boolean;
};
