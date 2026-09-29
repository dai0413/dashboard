import { FilterableFieldDefinition } from "@dai0413/myorg-shared";

type QuickFilterTab<T = string> = {
  key: string;
  label: string;
  value: T;
  onClick?: (() => void) | (() => Promise<void>);
  filterCondition?: FilterableFieldDefinition[];
  removeKey?: string[];
};

type QuickFilterTabsProps<T> = {
  items: QuickFilterTab<T>[];
  selectedKey?: string;
  onSelect: (item: QuickFilterTab<T>) => void;
  disabled?: boolean;
};

const QuickFilterTabs = <T,>({
  items,
  selectedKey,
  onSelect,
  disabled,
}: QuickFilterTabsProps<T>) => {
  if (disabled) return null;

  return (
    <div className="flex justify-between items-center bg-gray-200 border border-gray-200 p-2 rounded-md my-2">
      <div className="flex items-center gap-x-1">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item)}
            className={`cursor-pointer flex items-center p-1 border rounded-md ${
              item.key === selectedKey
                ? "bg-blue-500 text-white"
                : "border-gray-400 text-gray-700"
            }`}
          >
            <span>{item.label.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilterTabs;
