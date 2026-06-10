import { ModelType } from "../../types/models";
import { useEffect } from "react";
import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useForm } from "../../context/form-context";

import { getOnDetailFields } from "../../lib/model-fields";
import { useAuth } from "../../context/auth-context";
import { isDev } from "../../utils/env";
import { FieldList } from "./index";
import { FieldListData, FormMode, From, InputMode } from "../../types/types";
import { hasSteps } from "../../lib/form-steps/core/hasSteps";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";

import { useModal } from "../../context/modal-context";
import { useModelContext } from "../../context/models/model-wrapper";
import { ColumnType } from "../../types/table";

const SkeletonFieldList: React.FC<{ rows?: number }> = ({ rows = 6 }) => (
  <div className="space-y-2 text-sm text-gray-700 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex justify-between border-b py-1 items-center">
        <div className="w-1/3 h-4 bg-gray-200 rounded"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

const DetailModal = () => {
  const {
    detail: { isOpen, modelType, id, close },
    form: { open },
  } = useModal();

  const modelContext = useModelContext(modelType);

  const {
    modal: { alert, resetAlert, handleSetAlert },
  } = useAlert();

  const {
    formOperator: { startForm },
  } = useForm();

  const { staffState } = useAuth();

  useEffect(() => {
    if (isOpen && modelContext && id) {
      modelContext.readItem(id);
    }
  }, [isOpen, id]);

  if (!modelType) return <></>;

  if (!modelContext) return <></>;

  const { isLoading, selected, deleteItem } = modelContext;

  const displayableField = modelType ? getOnDetailFields(modelType) : [];

  const editOnClick = async () => {
    if (id) {
      const success = await startForm({
        id,
        modelType,
        formMode: FormMode.UPDATE,
        inputMode: InputMode.SINGLE,
        editItem: selected,
        from: From.NORMAL,
      });

      if (success) open(modelType);
    }
  };

  const deleteOnClick = () => {
    if (!id) return;

    const confirmDelete = window.confirm("本当に削除しますか？");
    if (confirmDelete) {
      deleteItem(id);
    }
  };

  const hasFormSteps: boolean = modelType ? hasSteps(modelType) : false;

  const fieldListData: FieldListData = selected
    ? Object.entries(selected).reduce<FieldListData>((acc, [key, value]) => {
        let displayValue: any;

        displayValue =
          typeof value === "undefined" || typeof value === null ? "" : value;

        const field = displayableField.find((fie) => fie.key === key);
        if (field?.getValueType === ColumnType.CUSTOM) {
          displayValue = field.getData(selected);
        }

        // match-format対応
        if (modelType === ModelType.MATCH_FORMAT && key === "period") {
          const fields = displayableField.filter(
            (fie) => fie.getValueType === ColumnType.CUSTOM,
          );

          fields.forEach((field) => {
            acc[field.key] = {
              value: field.getData(selected),
            };
          });
        }
        // registration-history対応
        if (
          (modelType === ModelType.PLAYER_REGISTRATION_HISTORY ||
            modelType === ModelType.STAFF_REGISTRATION_HISTORY) &&
          key === "changes"
        ) {
          const fields = displayableField.filter(
            (fie) => fie.getValueType === ColumnType.CUSTOM,
          );

          fields.forEach((field) => {
            acc[field.key] = {
              value: field.getData(selected),
            };
          });
        }

        acc[key] = {
          value: displayValue,
        };
        return acc;
      }, {})
    : {};

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => close()}
      header={
        <div className="flex items-center gap-x-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-700">詳細ページ</h3>
          {(staffState.admin || isDev) && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 px-2 hover:cursor-pointer"
              title="id_copy"
              onClick={() => {
                if (!fieldListData._id)
                  return handleSetAlert({
                    success: false,
                    message: `${modelType}のidコピーに失敗しました`,
                  });
                navigator.clipboard.writeText(fieldListData._id.value);
                handleSetAlert({
                  success: true,
                  message: `${modelType}のidをコピーしました`,
                });
              }}
            >
              <ClipboardDocumentListIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      }
      footer={
        hasFormSteps &&
        (staffState.admin || isDev) && (
          <LinkButtonGroup
            reset={{
              text: "編集",
              onClick: () => editOnClick(),
            }}
            deny={{
              text: "削除",
              onClick: () => deleteOnClick(),
            }}
          />
        )
      }
    >
      <Alert
        success={alert?.success || false}
        message={alert?.message}
        resetAlert={resetAlert}
      />

      {isLoading || !selected ? (
        <SkeletonFieldList rows={displayableField.length} />
      ) : (
        <FieldList
          fields={displayableField}
          isForm={false}
          data={fieldListData}
        />
      )}
    </Modal>
  );
};

export default DetailModal;
