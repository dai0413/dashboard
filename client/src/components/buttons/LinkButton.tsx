import { Link } from "react-router-dom";
import { colorMap } from "../../styles/colors";

type LinkButtonProps = {
  children: React.ReactNode;
  color: "green" | "red" | "gray";
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
  const baseClass =
    "mt-4 inline-flex items-center px-4 py-2 rounded-lg transition border-2";
  const classes = `${baseClass} ${colorMap[color].base} ${
    disabled ? "opacity-50 cursor-not-allowed" : colorMap[color].hover
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
