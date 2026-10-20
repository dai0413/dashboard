import { IconButton } from "../../../components/buttons";
import { SelectField } from "../../../components/field";
import { SummaryTabItems } from "../../../types/menu/IconButton";
import { createTabsOptionArray } from "../../../utils/tab/createTabsOptionArray";
import { TabState } from "../types";

type Props<T> = {
  items: SummaryTabItems[];
  tab: TabState<T>;
  accentColor?: string;
};

const getContrastTextColor = (hex: string) => {
  const color = hex.replace("#", "");

  if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
    return "#166534";
  }

  const [r, g, b] = [0, 2, 4].map(
    (i) => parseInt(color.slice(i, i + 2), 16) / 255,
  );

  const luminance = [r, g, b]
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
    .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);

  return luminance > 0.35 ? "#222222" : hex;
};

export default function SummaryTabMenu<T extends string | number | Date>({
  items,
  tab,
  accentColor = "#22C55E",
}: Props<T>) {
  const { selectedTab, handleSelect } = tab;
  const options = createTabsOptionArray(items);

  return (
    <div className="mb-4 pb-2">
      {/* SP: select */}
      <div className="mt-4 block sm:hidden">
        <SelectField
          type="text"
          value={selectedTab || ""}
          options={options}
          onChange={handleSelect}
        />
      </div>

      {/* PC: tabs */}
      <div className="hidden sm:flex gap-4 border-b border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
          {items.map(({ key, icon, text }) => {
            const tabKey = key ? key : icon;
            const isActive = selectedTab === tabKey;

            return (
              <li key={text}>
                <IconButton
                  icon={icon}
                  text={text}
                  color={isActive ? "green" : "gray"}
                  onClick={() => handleSelect(tabKey)}
                  direction="horizontal"
                  className={`
                    px-4 py-2 border-b-2
                    ${
                      isActive
                        ? "font-semibold"
                        : "border-transparent hover:border-gray-300"
                    }
                  `}
                  style={
                    isActive
                      ? {
                          borderBottomColor: accentColor,
                          color: getContrastTextColor(accentColor),
                        }
                      : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
