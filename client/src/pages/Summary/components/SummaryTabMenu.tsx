import { IconButton } from "../../../components/buttons";
import { SelectField } from "../../../components/field";
import { SummaryTabItems } from "../../../types/menu/IconButton";
import { createTabsOptionArray } from "../../../utils/tab/createTabsOptionArray";

type Props = {
  items: SummaryTabItems[];
  selectedTab: string;
  onChange: (value: string | number | Date | undefined) => void;
};

export default function SummaryTabMenu({
  items,
  selectedTab,
  onChange,
}: Props) {
  const options = createTabsOptionArray(items);

  return (
    <div className="mb-4 pb-2">
      {/* SP: select */}
      <div className="mt-4 block sm:hidden">
        <SelectField
          type="text"
          value={selectedTab}
          options={options}
          onChange={onChange}
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
                  key={key}
                  icon={icon}
                  text={text}
                  color={isActive ? "green" : "gray"}
                  onClick={() => onChange(tabKey)}
                  direction="horizontal"
                  className={`
                        px-4 py-2 border-b-2
                        ${
                          isActive
                            ? "border-green-500 text-green-700 font-semibold"
                            : "border-transparent hover:border-gray-300"
                        }
                    `}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
