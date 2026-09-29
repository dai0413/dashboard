import { useAuth } from "../../context/auth-context";
import { useForm } from "../../context/form-context";
import { useModal } from "../../context/modal-context";
import { Item } from "../../pages/AdminDashboard/types";
import { ModelType } from "../../types/models";
import { StartFormArgs } from "../../types/types";
import { isDev } from "../../utils/env";

type ActionButtonItem<T extends ModelType> = Item & {
  startFormArgs: StartFormArgs<T>;
  formModelType: T;
};

type ActionButtonListProps<T extends ModelType> = {
  items: ActionButtonItem<T>[];
};

export const ActionButtonList = <T extends ModelType>({
  items,
}: ActionButtonListProps<T>) => {
  const {
    form: { open: formOpen },
  } = useModal();
  const { staffState } = useAuth();
  const {
    formOperator: { startForm },
  } = useForm();

  if (staffState.admin || isDev)
    return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 text-sm">
        <span className="font-medium">データ取得</span>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <button
              key={item.desc}
              type="button"
              className="px-2 py-1 border border-gray-300 rounded-md
                     hover:bg-gray-100 hover:border-gray-400
                     cursor-pointer"
              onClick={() => {
                startForm(item.startFormArgs);
                formOpen(item.formModelType);
              }}
            >
              {item.startFormArgs.from}
            </button>
          ))}
        </div>
      </div>
    );
};
