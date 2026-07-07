import { Tooltip } from "@mui/material";
import { FormationItem } from "../../types/formation";
import { positionBase } from "./positionBase";
import { Link } from "react-router-dom";

const darken = (color: string, amount = 0.25) => {
  if (color === "white") return "black";
  if (!color.startsWith("#")) return color;

  const hex = color.slice(1);

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const f = 1 - amount;

  return `#${Math.round(r * f)
    .toString(16)
    .padStart(2, "0")}${Math.round(g * f)
    .toString(16)
    .padStart(2, "0")}${Math.round(b * f)
    .toString(16)
    .padStart(2, "0")}`;
};

export const PlayerMarker = ({
  position,
  centerText,
  link,
  label,
  tooltip,
  size = 48,
  color = "white",
  textColor = "black",
}: FormationItem) => {
  const point = positionBase[position as keyof typeof positionBase];

  if (!point) return;

  const markerContent = (
    <div className="flex cursor-pointer flex-col items-center">
      <div
        className="relative rounded-full shadow-lg"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          border: `2px solid ${darken(color)}`,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center font-bold"
          style={{
            color: textColor,
          }}
        >
          {centerText}
        </div>
      </div>

      {label && (
        <div className="mt-1 rounded-full bg-black/40 px-2 py-0.5 text-center text-[12px] font-medium text-white">
          {label}
        </div>
      )}
    </div>
  );

  const marker = link ? <Link to={link}>{markerContent}</Link> : markerContent;

  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{
        left: `${point.x}%`,
        top: `${point.y}%`,
      }}
    >
      {tooltip ? (
        <Tooltip
          arrow
          placement="top"
          title={
            <div className="text-center">
              {tooltip.map((line, index) => (
                <div
                  key={index}
                  className={line.bold ? "font-bold" : undefined}
                >
                  {line.text}
                </div>
              ))}
            </div>
          }
        >
          {marker}
        </Tooltip>
      ) : (
        marker
      )}
    </div>
  );
};
