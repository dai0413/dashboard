type Base = {
  type: "number" | "boolean" | "text" | "date" | "datetime-local";
  supportButton?: boolean;
};

export type SingleInputProps = Base & {
  multi?: false;
  value: string | number | Date;
  onChange: (value: string | number | boolean | Date | undefined) => void;
};

export type MultiInputProps = Base & {
  multi: true;
  values: string[];
  onChangeItem: (
    index: number,
    item: string | number | boolean | Date | undefined,
  ) => void;
};
