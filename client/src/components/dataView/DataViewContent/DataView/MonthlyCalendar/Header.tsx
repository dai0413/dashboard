const getVisibleItems = (
  items: CalendarHeaderItem[],
  selectedKey: string,
): (CalendarHeaderItem | null)[] => {
  if (items.length <= 9) return items;

  const selectedIndex = items.findIndex((item) => item.key === selectedKey);

  if (selectedIndex === -1) {
    return [items[0], null, ...items.slice(-1)];
  }

  const startIndex = Math.max(1, selectedIndex - 2);
  const endIndex = Math.min(items.length - 2, selectedIndex + 2);

  const result: (CalendarHeaderItem | null)[] = [items[0]];

  if (startIndex > 1) {
    result.push(null);
  }

  result.push(...items.slice(startIndex, endIndex + 1));

  if (endIndex < items.length - 2) {
    result.push(null);
  }

  result.push(items[items.length - 1]);

  return result;
};

type CalendarHeaderItem = {
  key: string;
  label: string;
};

type HeaderProps = {
  items: CalendarHeaderItem[];
  selectedKey: string;
  onChange: (key: string) => void;
};

export const Header = ({ items, selectedKey, onChange }: HeaderProps) => {
  const visibleItems = getVisibleItems(items, selectedKey);

  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div />

      <div className="flex items-center gap-2">
        {visibleItems.map((item, index) =>
          item ? (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`whitespace-nowrap rounded-md px-2 py-1 text-sm ${
                selectedKey === item.key
                  ? "bg-green-200 font-semibold"
                  : "hover:bg-green-100"
              }`}
            >
              {item.label}
            </button>
          ) : (
            <span key={`ellipsis-${index}`} className="px-1 text-gray-400">
              …
            </span>
          ),
        )}
      </div>

      <div />
    </div>
  );
};
