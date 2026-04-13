import { Icon } from "../../components/buttons/IconButton";
import { ModelType } from "../../types/models";
import { StartFormArgs } from "../../types/types";

export type Item = {
  model: string;
  desc: string;
  icon: Icon;
  link?: string;
  startFormArgs: StartFormArgs<ModelType>;
};
