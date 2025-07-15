import {
  PlusCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { colorMap } from "../../styles/colors";

type IconButtonProps = {
  icon: "add" | "delete" | "edit" | "arrow-up" | "arrow-down";
  color?: keyof typeof colorMap;
  onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({ icon, color, onClick }) => {
  const buttonColor = color ? colorMap[color].base : "primary";

  const baseClass = "cursor-pointer flex items-center text-2xl";
  const classes = `${baseClass} ${buttonColor} `;

  const iconClass = "w-6 h-6";

  switch (icon) {
    case "add":
      return (
        <button type="button" className={classes} onClick={onClick}>
          <PlusCircleIcon className={iconClass} />
        </button>
      );
    case "delete":
      return (
        <button type="button" className={classes} onClick={onClick}>
          <XMarkIcon className={iconClass} />
        </button>
      );
    case "edit":
      return (
        <button type="button" className={classes} onClick={onClick}>
          <PencilSquareIcon className={iconClass} />
        </button>
      );
    case "arrow-up":
      return (
        <button type="button" className={classes} onClick={onClick}>
          <ArrowUpIcon className={iconClass} />
        </button>
      );
    case "arrow-down":
      return (
        <button type="button" className={classes} onClick={onClick}>
          <ArrowDownIcon className={iconClass} />
        </button>
      );
    default:
      return <></>;
  }
};

export default IconButton;
