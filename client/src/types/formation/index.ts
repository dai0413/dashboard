import { ReactNode } from "react";
import { positionBase } from "../../components/formation/positionBase";

type TooltipLine = {
  text: string;
  bold?: boolean;
};

export type FormationItem = {
  position: keyof typeof positionBase;

  centerText?: ReactNode;
  label?: ReactNode;
  link?: string;

  tooltip?: TooltipLine[];

  size?: number;
  color?: string;
  textColor?: string;
};
