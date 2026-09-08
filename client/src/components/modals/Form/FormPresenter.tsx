import { FormHeader } from "./ui/FormHeader";
import { FormFooter } from "./ui/FormFooter";
import { Modal } from "../../ui";
import { FormController } from "./types";
import { FormTypeMap } from "../../../types/models";
import { Loader2 } from "lucide-react";
import { StepRenderer } from "./renderers/StepRenderer";
import { useForm } from "../../../context/form-context";
import SingleEditForm from "./Single/SingleEditForm";
import { useMemo } from "react";
import { FormMode, ModalSize } from "../../../types/types";
import { DataSource } from "../../../types/form";

export const FormPresenter = <T extends keyof FormTypeMap>(
  props: FormController<T>,
) => {
  const { isTableOpen, toggleTableOpen, isOpen, close } = props;
  const {
    modelType,
    formMode,
    isProcessing,
    inputMode,
    isEditing,
    steps,
    many,
    single,
    options,
    filterConditionsObj,
    action,
    actions,
  } = useForm<T>();

  const deny = useMemo(() => {
    if (isTableOpen) {
      return {
        text: "戻る",
        onClick: toggleTableOpen,
      };
    } else {
      return {
        text: "戻る",
        onClick: steps.prevStep,
      };
    }
  }, [
    isTableOpen,
    steps.currentStep,
    steps.formSteps,
    toggleTableOpen,
    steps.prevStep,
    steps.nextData,
    steps.processStep,
  ]);

  const approve = useMemo(() => {
    const isLastStep = steps.currentStep === steps.formSteps.length - 1;
    if (isTableOpen) {
      return undefined;
    } else if (isLastStep) {
      if (!isEditing) {
        return {
          text: "次のデータへ",
          onClick: steps.nextData,
        };
      }

      return {
        text: formMode === FormMode.CREATE ? "追加" : "更新",
        onClick: () => {
          steps.processStep();
          // props.setFormPage(1);
        },
      };
    } else {
      return {
        text: "次へ",
        onClick: steps.processStep,
      };
    }
  }, [
    isTableOpen,
    steps.currentStep,
    steps.formSteps,
    toggleTableOpen,
    steps.prevStep,
    steps.nextData,
    steps.processStep,
  ]);

  const headingLabel = useMemo(() => {
    return formMode === "create"
      ? `${modelType} : 新規データ作成`
      : `${modelType} : 既存データ編集`;
  }, [modelType, formMode]);

  const currentAction = useMemo(() => {
    if (!actions || !action.actionIndex) return;

    return actions[action.actionIndex];
  }, [actions, action.actionIndex]);

  return (
    <>
      <Modal
        size={ModalSize.LARGE}
        isOpen={isOpen}
        onClose={close}
        header={
          <FormHeader
            headingLabel={headingLabel}
            formSteps={steps.formSteps}
            currentStep={steps.currentStep}
            alert={props.alert}
            resetAlert={props.resetAlert}
          />
        }
        footer={<FormFooter deny={deny} approve={approve} />}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center py-16">
            <div className="bg-gray-50 px-8 py-10 text-center">
              <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
            </div>
          </div>
        ) : (
          <StepRenderer
            inputMode={inputMode}
            isTableOpen={isTableOpen}
            toggleTableOpen={toggleTableOpen}
            options={options}
            step={steps.formSteps[steps.currentStep]}
            filterConditionsObj={filterConditionsObj}
            single={single}
            many={many}
          />
        )}
      </Modal>

      {currentAction && currentAction && (
        <Modal
          size={ModalSize.SMALL}
          isOpen={true}
          onClose={action.closeActionModal}
          header={
            <FormHeader
              headingLabel={currentAction.label}
              alert={props.alert}
              resetAlert={props.resetAlert}
            />
          }
          footer={
            <FormFooter
              approve={{
                text: "取得",
                onClick: async () => {
                  try {
                    await currentAction.onClick();

                    action.closeActionModal();
                  } finally {
                  }
                },
              }}
            />
          }
        >
          <SingleEditForm
            options={options}
            fields={currentAction.fields}
            filterConditionsObj={filterConditionsObj}
            formData={single.state}
            formLabel={single.stateLabel}
            handleFormData={(props) =>
              single.handleFormData({
                ...props,
                dataSource: DataSource.META_DATA,
              })
            }
            displaySupportButton={true}
          />
        </Modal>
      )}
    </>
  );
};
