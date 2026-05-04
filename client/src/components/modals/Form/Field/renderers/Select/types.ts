import { OptionArray } from "../../../../../../types/form/option";

type Base = {
  options: OptionArray;
};

export type MultiSelectProps = Base & {
  multi: true;
  uniqueInArray?: boolean;
  lengthInArray?: number;
  values: string[];
  onChangeItem: (
    index: number,
    item: string | number | Date | undefined,
  ) => void;
};

export type SingleSelectProps = Base & {
  multi?: false;
  value: string | number | Date;
  onChangeObj: (value: Record<string, any> | undefined) => void;
};
