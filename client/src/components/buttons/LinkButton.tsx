import { Link } from "react-router-dom";
import { colorMap } from "../../styles/colors";

type LinkButtonProps = {
  children: React.ReactNode;
  color?: keyof typeof colorMap;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  color,
  to,
  onClick,
  disabled,
}) => {
  const buttonColor = color ? colorMap[color].base : "primary";
  const hoverColor = color ? colorMap[color].hover : "primary";

  const baseClass =
    "inline-flex items-center px-4 py-2 rounded-lg transition border-2";
  const classes = `${baseClass} ${buttonColor} ${
    disabled ? "opacity-50 cursor-not-allowed" : hoverColor
  }`;

  if (to && !disabled) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  } else if (to && disabled) {
    return <span className={classes}>{children}</span>;
  } else {
    return (
      <button onClick={onClick} className={classes} disabled={disabled}>
        {children}
      </button>
    );
  }
};

export default LinkButton;
