import { Link } from "react-router-dom";
import { RenderCellValue } from "../../types/table";
import React from "react";

type RendarCellProps = {
  value: RenderCellValue | RenderCellValue[];
  isRed?: boolean;
  onClick?: () => void;
};

export const RenderCell = ({
  value,
  isRed,
  onClick,
}: RendarCellProps): React.ReactNode => {
  const renderValue = (value: RenderCellValue) => {
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

  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && ", "}
            {renderValue(item)}
          </React.Fragment>
        ))}
      </>
    );
  }

  return renderValue(value);
};

export default RenderCell;
