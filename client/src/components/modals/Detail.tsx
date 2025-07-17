import { useNavigate, useParams } from "react-router-dom";
import { ModelContext } from "../../types/context";
import { FormTypeMap, ModelType } from "../../types/models";
import { useEffect } from "react";
import { LinkButtonGroup } from "../buttons";
import { Loading, Modal } from "../ui";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { Label } from "../../types/types";
import { useForm } from "../../context/form-context";

type DetailModalProps<K extends keyof FormTypeMap> = {
  closeLink: string;
  modelType: ModelType | null;
  modelContext: ModelContext<K>;
  title: string;
};

const DetailModal = <K extends keyof FormTypeMap>({
  closeLink,
  modelType,
  modelContext,
  title,
}: DetailModalProps<K>) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { selected, formData, readItem, deleteItem, formSteps } = modelContext;

  const {
    modal: { alert },
  } = useAlert();

  const { isOpen, openForm } = useForm();

  useEffect(() => {
    if (id) {
      readItem(id);
    }
  }, [id, isOpen]);

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

  return !selected ? (
    <Modal isOpen={true} onClose={() => navigate(closeLink)}>
      {alert.success ? (
        <Alert success={alert?.success || false} message={alert?.message} />
      ) : (
        <Loading />
      )}
    </Modal>
  ) : (
    <Modal isOpen={true} onClose={() => navigate(-1)}>
      <Alert success={alert?.success || false} message={alert?.message} />
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>

      <div className="space-y-2 text-sm text-gray-700">
        {Object.entries(selected)
          .filter(([key, value]) => key !== "_id" && key !== "__v" && value)
          .map(([key, value]) => {
            const inputFields = formSteps.flatMap((step) => step.fields || []);
            const field = inputFields.find((f) => f.key === key);

            let displayValue = value || "";

            if (
              value &&
              typeof value === "object" &&
              "label" in value &&
              "id" in value
            )
              displayValue = value.label;

            if (field?.type === "select" || field?.type === "table") {
              if (
                typeof value === "object" &&
                value !== null &&
                "label" in value
              ) {
                const withLabel = value as Label;
                displayValue = withLabel.label;
              }
            }

            if (field?.type === "date" && value) {
              // console.log(field, key, value);
              const date = new Date(value as string);
              displayValue = new Intl.DateTimeFormat("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(date);
            }

            if (
              (field?.type === "multiselect" || field?.type === "multiInput") &&
              value
            ) {
              const urls = value as string[];
              displayValue = urls.filter((u) => u.trim() !== "").join(", ");
            }

            if (field?.type === "multiurl" && value) {
              const urls = value as string[];
              const validUrls = urls.filter((u) => u.trim() !== "");

              return (
                <div key={key} className="flex justify-between border-b py-1">
                  <span className="font-semibold">{field?.label ?? key}</span>
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
            }

            return (
              <div key={key} className="flex justify-between border-b py-1">
                <span className="font-semibold">{field?.label ?? key}</span>
                <span>{String(displayValue)}</span>
              </div>
            );
          })}
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
      </div>
    </Modal>
  );
};

export default DetailModal;
