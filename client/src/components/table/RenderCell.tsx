import { Link } from "react-router-dom";
import { RenderCellValue } from "../../types/table";
import React from "react";
import { isRenderCellValue } from "../../utils/data/isLabelObject";

const RenderCell = (
  value: RenderCellValue | RenderCellValue[] | string,
): React.ReactNode => {
  const renderValue = (value: RenderCellValue | string) => {
    if (!isRenderCellValue(value)) {
      return value;
    }

    if (value.to) {
      return (
        <Link to={value.to} className="hover:text-blue-600 underline">
          {value.label}
        </Link>
      );
    }

    return value.label;
  };

  if (Array.isArray(value)) {
    return (
      <>
        {value.map((item, index) => (
          <React.Fragment key={item.id ?? index}>
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
