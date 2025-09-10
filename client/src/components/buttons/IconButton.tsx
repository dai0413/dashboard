import {
  PlusCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  HomeIcon,
  UserCircleIcon,
  QueueListIcon,
  TableCellsIcon,
  FlagIcon,
  UserIcon,
  UserMinusIcon,
  UserPlusIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowLeftEndOnRectangleIcon,
  FolderOpenIcon,
  PresentationChartLineIcon,
  RectangleGroupIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { colorMap } from "../../styles/colors";
import { useNavigate } from "react-router-dom";

export type Icon =
  | "add"
  | "delete"
  | "edit"
  | "arrow-up"
  | "arrow-down"
  | "home"
  | "my-page"
  | "transfer"
  | "injury"
  | "nationality"
  | "player"
  | "transfer_in"
  | "transfer_out"
  | "future_in"
  | "loan"
  | "series"
  | "match"
  | "tournament"
  | "team"
  | "callup"
  | "setting"
  | "competition"
  | "competitionStage"
  | "teamCompetitionSeason";

export type IconButtonProps = {
  icon?: Icon;
  text?: string;
  color?: keyof typeof colorMap;
  onClick?: () => void;
  to?: string;
  direction?: "horizontal" | "vertical";
  className?: string;
};

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  color,
  onClick,
  to,
  direction = "horizontal",
  className = "",
}) => {
  const navigate = useNavigate();
  const buttonColor = color ? colorMap[color].base : "primary";
  const iconClass = "w-6 h-6";

  const layoutClass =
    direction === "vertical"
      ? "flex flex-col items-center justify-center"
      : "flex flex-row items-center gap-1";

  const isDisabled = className.includes("cursor-not-allowed");

  const finalClassName = [
    !isDisabled && "cursor-pointer",
    layoutClass,
    buttonColor,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const textClass = className.includes("text") ? "" : "text-sm";

  const IconComponent = (() => {
    switch (icon) {
      case "add":
        return <PlusCircleIcon className={iconClass} />;
      case "delete":
        return <XMarkIcon className={iconClass} />;
      case "edit":
        return <PencilSquareIcon className={iconClass} />;
      case "arrow-up":
        return <ArrowUpIcon className={iconClass} />;
      case "arrow-down":
        return <ArrowDownIcon className={iconClass} />;
      case "home":
        return <HomeIcon className={iconClass} />;
      case "transfer":
        return <QueueListIcon className={iconClass} />;
      case "injury":
        return <TableCellsIcon className={iconClass} />;
      case "my-page":
        return <UserCircleIcon className={iconClass} />;
      case "nationality":
        return <FlagIcon className={iconClass} />;
      case "transfer_in":
        return <UserPlusIcon className={iconClass} />;
      case "transfer_out":
        return <UserMinusIcon className={iconClass} />;
      case "player":
        return <UserIcon className={iconClass} />;
      case "loan":
        return <ArrowLeftStartOnRectangleIcon className={iconClass} />;
      case "future_in":
        return <ArrowLeftEndOnRectangleIcon className={iconClass} />;
      case "series":
        return <FolderOpenIcon className={iconClass} />;
      case "match":
        return <PresentationChartLineIcon className={iconClass} />;
      case "tournament":
        return <RectangleGroupIcon className={iconClass} />;
      case "team":
      case "teamCompetitionSeason":
        return <UserGroupIcon className={iconClass} />;
      case "callup":
        return <ClipboardDocumentListIcon className={iconClass} />;
      case "setting":
        return <WrenchScrewdriverIcon className={iconClass} />;
      case "competition":
      case "competitionStage":
        return <TrophyIcon className={iconClass} />;

      default:
        return null;
    }
  })();

  return (
    <button
      type="button"
      onClick={() => {
        onClick && onClick();
        to && navigate(to);
      }}
      className={finalClassName}
      disabled={className?.includes("cursor-not-allowed")}
    >
      {IconComponent}
      {text && <span className={textClass}>{text}</span>}
    </button>
  );
};

export default IconButton;
