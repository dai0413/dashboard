import { Link } from "react-router-dom";
import { GroupedSummaryItems } from "../../types/summaryItem";
import HomeCard from "./HomeCard";
import { RenderCellValue } from "../../types/table";

type SummaryCardProps = {
  title: string;
  text: string;
  groupedSummaryItems: GroupedSummaryItems[];
};

export const SummaryCard = ({
  title,
  text,
  groupedSummaryItems,
}: SummaryCardProps) => {
  return (
    <div className="mt-10">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{text}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {groupedSummaryItems.map((groupedSummaryItem) => (
          <HomeCard
            key={groupedSummaryItem.title.label}
            to={groupedSummaryItem.title.to}
            title={groupedSummaryItem.title.label}
          >
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {groupedSummaryItem.summaryItems.map((summaryItem) => {
                const { colors, mainText, subText } = summaryItem;

                const primaryColor = colors.length > 0 ? colors[0] : "#16A34A";

                const backgroundImage =
                  colors.length > 0
                    ? `linear-gradient(to right, ${colors
                        .map((color, index) => {
                          const start = (index / colors.length) * 100;
                          const end = ((index + 1) / colors.length) * 100;
                          const lightColor = `color-mix(in srgb, ${color} 30%, white)`;

                          return `${lightColor} ${start}%, ${lightColor} ${end}%`;
                        })
                        .join(", ")})`
                    : undefined;

                const className = `flex h-14 min-w-0 items-center justify-center rounded-lg border border-gray-200 px-2 py-1 text-center text-sm font-medium text-gray-700 transition-colors ${
                  colors.length === 0 ? "bg-gray-50 hover:bg-green-50" : ""
                }`;

                const style = {
                  backgroundImage,
                  "--team-primary-color": primaryColor,
                } as React.CSSProperties;

                // Linkごとに独立したホバー処理
                const linkProps = {
                  onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = primaryColor;
                  },
                  onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.color = "";
                  },
                };

                const renderText = (
                  text: RenderCellValue,
                  type: "main" | "sub",
                ) => {
                  const textClassName =
                    type === "main"
                      ? "w-full truncate"
                      : "w-full truncate text-xs font-normal text-gray-500";

                  if (text.to) {
                    return (
                      <Link
                        to={text.to}
                        className={`${textClassName} hover:underline`}
                        title={text.label}
                        {...linkProps}
                      >
                        {text.label}
                      </Link>
                    );
                  }

                  return (
                    <span className={textClassName} title={text.label}>
                      {text.label}
                    </span>
                  );
                };

                return (
                  <div key={mainText.label} className={className} style={style}>
                    <div className="flex w-full min-w-0 flex-col items-center gap-0.5">
                      {renderText(mainText, "main")}

                      {subText?.label && renderText(subText, "sub")}
                    </div>
                  </div>
                );
              })}
            </div>
            {groupedSummaryItem.summaryItems.length === 0 && (
              <p className="py-6 text-center text-sm text-gray-400">
                データがありません。
              </p>
            )}
          </HomeCard>
        ))}
      </div>
    </div>
  );
};
