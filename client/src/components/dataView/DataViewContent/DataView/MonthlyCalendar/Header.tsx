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
  return (
    <div className="flex min-w-[900px] items-center justify-between border-b border-gray-300 px-4 py-3">
      <div />

      <div className="flex items-center gap-2">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm ${
              selectedKey === item.key
                ? "bg-gray-200 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div />
    </div>
  );
};
