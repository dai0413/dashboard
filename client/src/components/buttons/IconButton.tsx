import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { colorMap } from "../../styles/colors";

type IconButtonProps = {
  icon: "add" | "delete" | "edit";
  color?: keyof typeof colorMap;
  onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({ icon, color, onClick }) => {
  const buttonColor = color ? colorMap[color].base : "primary";

  const baseClass = "cursor-pointer flex items-center text-2xl";
  const classes = `${baseClass} ${buttonColor} `;

  const iconjsx =
    icon === "add" ? (
      <PlusCircleIcon className="w-6 h-6" />
    ) : icon === "delete" ? (
      <XMarkIcon className="w-6 h-6" />
    ) : (
      <PencilSquareIcon className="w-6 h-6" />
    );

  return (
    <button type="button" className={classes} onClick={onClick}>
      {iconjsx}
    </button>
  );
};

export default IconButton;
