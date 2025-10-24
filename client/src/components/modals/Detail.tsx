import { useNavigate, useParams } from "react-router-dom";
import { ModelContext } from "../../types/context";
import { FormTypeMap, ModelType } from "../../types/models";
import { useEffect } from "react";
import { LinkButtonGroup } from "../buttons";
import { Modal } from "../ui";
import Alert from "../layout/Alert";
import { useAlert } from "../../context/alert-context";
import { useForm } from "../../context/form-context";

import { fieldDefinition } from "../../lib/model-fields";
import { DetailFieldDefinition, isDisplayOnDetail } from "../../types/field";
import { useAuth } from "../../context/auth-context";
import { isDev } from "../../utils/env";
import { FieldList } from "../modals/index";
import { FieldListData } from "../../types/types";

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
  modelType: K | null;
  modelContext: ModelContext<K>;
  title: string;
};

const DetailModal = <K extends keyof FormTypeMap>({
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

  const fieldListData: FieldListData = selected
    ? Object.entries(selected).reduce<FieldListData>((acc, [key, value]) => {
        let displayValue: any;

        displayValue =
          typeof value === "undefined" || typeof value === null ? "" : value;

        // match-format対応
        if (modelType === ModelType.MATCH_FORMAT && key === "period") {
          const fields = displayableField.filter((fie) => !!fie.getValue);

          fields.forEach((field) => {
            if (field.getValue)
              acc[field.key] = {
                value: field.getValue(selected),
              };
          });
        }
        //

        acc[key] = {
          value: displayValue,
        };
        return acc;
      }, {})
    : {};

  return (
    <Modal
      isOpen={true}
      onClose={() => navigate(-1)}
      header={
        <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      }
      footer={
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
