import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTransfer } from "../context/transfer-context";
import { steps } from "../lib/form-steps/index";
import { Label } from "../types/types";
import { Modal, Loading } from "../components/ui";
import { LinkButtonGroup } from "../components/buttons";
import Alert from "../components/layout/Alert";
import { useAlert } from "../context/alert-context";

const TransferDetail = () => {
  const closeLink = "/transfer";
  const navigate = useNavigate();
  const { id } = useParams();
  const { readItem, selected, updateItem, deleteItem } = useTransfer();
  const {
    modal: { alert },
  } = useAlert();

  useEffect(() => {
    if (id) {
      readItem(id);
    }
  }, [id]);

  const editOnClick = () => (id ? updateItem(id) : undefined);

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
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        {"データ詳細"}
      </h3>

      <div className="space-y-2 text-sm text-gray-700">
        {Object.entries(selected)
          .filter(([key]) => key !== "_id" && key !== "__v")
          .map(([key, value]) => {
            const field = steps
              .flatMap((step) => step.fields || [])
              .find((f) => f.key === key);

            let displayValue = value || "";

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
              try {
                const date = new Date(value as string);
                displayValue = new Intl.DateTimeFormat("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(date);
              } catch {
                // 無効な日付ならそのまま表示
              }
            }

            if (field?.type === "multiselect" && value) {
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

export default TransferDetail;
