import { JSX, ReactNode } from "react";
import { colorMap } from "../../styles/colors";
import {
  PlusCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

type IconType = "add" | "delete" | "edit";

type IconTextButtonProps = {
  icon: IconType;
  children: ReactNode;
  onClick?: () => void;
  color?: keyof typeof colorMap;
  disabled?: boolean;
};

const iconMap: Record<IconType, JSX.Element> = {
  add: <PlusCircleIcon className="w-5 h-5 mr-2" />,
  delete: <XMarkIcon className="w-5 h-5 mr-2" />,
  edit: <PencilSquareIcon className="w-5 h-5 mr-2" />,
};

const IconTextButton = ({
  icon,
  children,
  onClick,
  color,
  disabled = false,
}: IconTextButtonProps) => {
  const baseClass = `inline-flex items-center px-3 py-2 rounded-md transition text-sm border`;
  const colorBase = color ? colorMap[color].base : "primary";
  const colorHover = color ? colorMap[color].hover : "primary";

  const classes = `${baseClass} ${colorBase} ${
    disabled ? "opacity-50 cursor-not-allowed" : colorHover
  }`;

  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      {iconMap[icon]}
      {children}
    </button>
  );
};

export default IconTextButton;
