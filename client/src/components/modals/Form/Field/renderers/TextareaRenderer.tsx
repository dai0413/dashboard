import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrayFieldWrapper } from "../wrappers/ArrayFieldWrapper";

type TextareaRendererProps = {
  multi?: boolean;
  items: string[];
  onChangeItem: (index: number, item: string | undefined) => void;
};

export const TextareaRenderer = ({
  multi,
  items,
  onChangeItem,
}: TextareaRendererProps) => {
  if (multi) {
    return (
      <ArrayFieldWrapper
        items={items}
        renderItem={(item: string, index: number) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={item}
              onChange={(e) => {
                onChangeItem(index, e.target.value);
              }}
            />

            <button
              type="button"
              onClick={() => onChangeItem(index, undefined)}
              className="cursor-pointer text-gray-500 hover:text-gray-700 text-2xl"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      />
    );
  }
};
