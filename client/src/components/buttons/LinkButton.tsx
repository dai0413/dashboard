import { Link } from "react-router-dom";

type LinkButtonProps = {
  children: React.ReactNode;
  color: string;
  to?: string;
  onClick?: () => void;
};

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  color,
  to,
  onClick,
}) => {
  return (
    <>
      {to ? (
        <Link
          to={to}
          className={`mt-4 inline-flex items-center text-${color}-500 border-2 border-${color}-500 hover:bg-${color}-500 hover:text-white px-4 py-2 rounded-lg transition`}
        >
          {children}
        </Link>
      ) : (
        <button
          className={`mt-4 inline-flex items-center text-${color}-500 border-2 border-${color}-500 hover:bg-${color}-500 hover:text-white px-4 py-2 rounded-lg transition`}
          onClick={onClick}
        >
          {children}
        </button>
      )}
    </>
  );
};

export default LinkButton;
