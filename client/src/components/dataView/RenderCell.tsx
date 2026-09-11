import { Link } from "react-router-dom";
import { RenderCellValue } from "../../types/table";
import React from "react";

type Props = {
  value: RenderCellValue;
  index?: number;
  isLink?: boolean;
  isRed?: boolean;
  onClick?: () => void;
};

const renderValue = ({ value, index, isLink, isRed, onClick }: Props) => {
  if (isLink && index !== undefined) {
    return (
      <a
        key={value.label}
        href={value.label}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        link-{index + 1}
      </a>
    );
  }

  if (value.to) {
    return (
      <Link
        to={value.to}
        onClick={onClick}
        className={[
          "hover:text-blue-600 underline",
          isRed ? "text-red-500 font-semibold" : "",
        ].join(" ")}
      >
        {value.label}
      </Link>
    );
  }

  return (
    <span className={isRed ? "text-red-500 font-semibold" : ""}>
      {value.label}
    </span>
  );
};

type RendarCellProps = {
  value: RenderCellValue | RenderCellValue[];
  isRed?: boolean;
  isLink?: boolean;
  onClick?: () => void;
};

export const RenderCell = ({
  value,
  isRed,
  isLink,
  onClick,
}: RendarCellProps): React.ReactNode => {
  if (Array.isArray(value)) {
    return (
      <div className="flex gap-2">
        {value.map((item, index) => (
          <React.Fragment key={index}>
            {renderValue({ value: item, index, isLink, isRed, onClick })}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return renderValue({ value, index: 0, isLink, isRed, onClick });
};

export default RenderCell;
