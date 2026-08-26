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
import { useModelContext } from "../../context/models/model-wrapper";
import { ColumnType } from "../../types/table";
import { SkeletonFieldList } from "./SkeletonFieldList";
import CopyButton from "./Detail/ModelData/CopyButton";

type ModelDataDetailProps = {
  title: string;
  modelType: ModelType | null;
  isOpen: boolean;
  id: string | null;
  formOpen: (modelType: ModelType, id: string) => void;
  close: () => void;
};

const ModelDataDetail = ({
  title,
  modelType,
  isOpen,
  id,
  formOpen,
  close,
}: ModelDataDetailProps) => {
  if (!modelType) return;

  const modelContext = useModelContext(modelType);

  if (!modelContext) return <></>;

  const {
    modal: { alert, resetAlert },
  } = useAlert();

  const {
    formOperator: { startForm },
  } = useForm();

  const { staffState } = useAuth();

  useEffect(() => {
    if (modelContext && id) {
      modelContext.readItem(id);
    }
  }, [isOpen, id]);

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

      if (success) formOpen(modelType, id);
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
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          <CopyButton />
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

export default ModelDataDetail;
