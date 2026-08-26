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
import { FormMode, From, InputMode } from "../../types/types";
import { hasSteps } from "../../lib/form-steps/core/hasSteps";
import { useModelContext } from "../../context/models/model-wrapper";
import { SkeletonFieldList } from "./SkeletonFieldList";
import CopyButton from "./Detail/ModelData/CopyButton";
import FieldList2 from "./FieldList2";
import { DisplayListItem } from "../../types/detail";

type ModelDataDetailProps = {
  title: string;
  modelType: ModelType | null;
  isOpen: boolean;
  data: DisplayListItem[];
  id: string | null;
  formOpen: (modelType: ModelType, id: string) => void;
  close: () => void;
};

const ModelDataDetail = ({
  title,
  modelType,
  isOpen,
  data,
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
        <FieldList2 data={data} onCLick={close} />
      )}
    </Modal>
  );
};

export default ModelDataDetail;
