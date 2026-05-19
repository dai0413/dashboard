import { FormStep } from "../../../../types/form";
import { FormTypeMap } from "../../../../types/models";
import { FormMode } from "../../../../types/types";
import { LinkButtonGroup } from "../../../buttons";

type FormFooter<T extends keyof FormTypeMap> = {
  isTableOpen: boolean;
  setIsTableOpen: (v: boolean) => void;
  formSteps: FormStep<T>[];
  currentStep: number;
  isEditing: boolean;
  formMode: FormMode;
  nextData: () => void;
  processStep: () => void;
  prevStep: () => void;
  setFormPage: (p: number) => void;
};

export const FormFooter = <T extends keyof FormTypeMap>({
  isTableOpen,
  setIsTableOpen,
  formSteps,
  currentStep,
  isEditing,
  formMode,
  nextData,
  processStep,
  prevStep,
  setFormPage,
}: FormFooter<T>) => {
  const isLastStep = currentStep === formSteps.length - 1;

  if (isTableOpen) {
    return (
      <div>
        <LinkButtonGroup
          deny={{
            text: "戻る",
            color: "red",
            onClick: () => setIsTableOpen(false),
          }}
        />
      </div>
    );
  }

  if (isLastStep && !isEditing) {
    return (
      <div>
        <LinkButtonGroup
          approve={{
            text: "次のデータへ",
            color: "green",
            onClick: nextData,
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <LinkButtonGroup
        approve={{
          text:
            formSteps && currentStep === formSteps.length - 1
              ? formMode === "create"
                ? "追加"
                : "変更"
              : "次へ",
          color: "green",
          onClick: () => {
            processStep();
            setFormPage(1);
          },
        }}
        deny={{
          text: "戻る",
          color: "red",
          onClick: prevStep,
          disabled: currentStep === 0,
        }}
      />
    </div>
  );
};
