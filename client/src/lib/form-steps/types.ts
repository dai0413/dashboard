import { From, InputMode } from "../../types/types";

export type FormStepsConfig = {
  [key in InputMode]?: {
    [key in From]?: {
      label: string;
      steps: any;
    };
  };
};
