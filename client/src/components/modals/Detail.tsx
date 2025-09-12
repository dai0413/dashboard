import { useNavigate, useParams } from "react-router-dom";
import { ModelContext } from "../../types/context";
import { FormTypeMap, ModelType } from "../../types/models";
import { useEffect } from "react";
import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useForm } from "../../context/form-context";
import { isLabelObject, toDateKey } from "../../utils";

import { fieldDefinition } from "../../lib/model-fields";
import { DetailFieldDefinition, isDisplayOnDetail } from "../../types/field";
import { useAuth } from "../../context/auth-context";
import { isDev } from "../../utils/env";

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

type DetailModalProps<K extends keyof FormTypeMap> = {
  closeLink: string;
  modelType: ModelType | null;
  modelContext: ModelContext<K>;
  title: string;
};

const DetailModal = <K extends keyof FormTypeMap>({
  // closeLink,
  modelType,
  modelContext,
  title,
}: DetailModalProps<K>) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    metacrud: { isLoading, selected, readItem, deleteItem },
  } = modelContext;

  const {
    modal: { alert, resetAlert },
  } = useAlert();

  const {
    isOpen,
    formOperator: { openForm },
  } = useForm();
  const { staffState } = useAuth();

  useEffect(() => {
    if (id) {
      readItem(id);
    }
  }, [id, isOpen]);

  const displayableField = modelType
    ? (fieldDefinition[modelType].filter(
        isDisplayOnDetail
      ) as DetailFieldDefinition[])
    : [];

  const editOnClick = () => {
    selected ? openForm(false, modelType || null, selected) : undefined;
  };

  const deleteOnClick = () => {
    if (!id) return;

    const confirmDelete = window.confirm("本当に削除しますか？");
    if (confirmDelete) {
      deleteItem(id);
    }
  };

  return (
    <Modal isOpen={true} onClose={() => navigate(-1)}>
      <Alert
        success={alert?.success || false}
        message={alert?.message}
        resetAlert={resetAlert}
      />
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      {isLoading || !selected ? (
        <SkeletonFieldList rows={displayableField.length} />
      ) : (
        <div className="space-y-2 text-sm text-gray-700">
          {displayableField.map((field) => {
            const value = selected[field.key as keyof typeof selected];

            let displayValue = value || "";

            if (isLabelObject(value)) displayValue = value.label || "";

            displayValue =
              field.type === "Date" && value
                ? (displayValue = toDateKey(value as string | number | Date))
                : displayValue;

            displayValue =
              Array.isArray(value) && value
                ? value.filter((u) => u.trim() !== "").join(", ")
                : displayValue;

            if (field.label === "URL") {
              const urls = Array.isArray(value) ? value : [value];
              const validUrls = urls.filter(
                (u) => typeof u === "string" && u.trim() !== ""
              );

              return (
                <div
                  key={field.key}
                  className="flex justify-between border-b py-1"
                >
                  <span className="font-semibold">
                    {field?.label ?? field.key}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {validUrls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        link-{index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={field.key}
                  className="flex justify-between border-b py-1"
                >
                  <span className="font-semibold">
                    {field?.label ?? field.key}
                  </span>
                  <span>{String(displayValue)}</span>
                </div>
              );
            }
          })}
          {(staffState.admin || isDev) && (
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
          )}
        </div>
      )}
    </Modal>
  );
};

export default DetailModal;
