import { Modal } from "../ui/index";
import { selectFields } from "../../types/models";

function getInputType(value: any): "text" | "date" | "number" {
  if (typeof value === "number") return "number";
  if (value instanceof Date) return "date";
  return "text";
}

type FormProps<T extends Record<string, any>> = {
  formOpen: boolean;
  setFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: T;
};

function Form<T extends Record<string, any>>({
  formOpen,
  setFormOpen,
  formData,
}: FormProps<T>) {
  return (
    <Modal isOpen={formOpen} onClose={() => setFormOpen(false)}>
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {"新規データ作成"}
      </h3>
      <a className="text font-semibold text-gray-700 mb-4">
        {"追加するデータを入力してください。"}
      </a>
      {Object.entries(formData).map(([key, value]) => {
        const inputType = getInputType(value);

        return (
          <div key={key} className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-1">
              {key}
            </label>

            {selectFields[key] ? (
              <select
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={value ?? ""}
                onChange={(e) => {
                  const selectedValue =
                    e.target.value === "" ? null : e.target.value;
                  console.log(selectedValue);
                }}
              >
                <option value="">未選択</option>
                {selectFields[key].map((option) =>
                  option === null ? null : (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </select>
            ) : (
              <input
                type={inputType}
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={
                  inputType === "date"
                    ? value instanceof Date
                      ? value.toISOString().split("T")[0]
                      : value
                    : value
                }
                onChange={(e) => {
                  const newValue =
                    inputType === "number"
                      ? Number(e.target.value)
                      : inputType === "date"
                      ? new Date(e.target.value)
                      : e.target.value;
                  console.log(newValue);
                }}
              />
            )}
          </div>
        );
      })}
    </Modal>
  );
}

export default Form;
