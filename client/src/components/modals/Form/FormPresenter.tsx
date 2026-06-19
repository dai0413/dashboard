import { FormHeader } from "./ui/FormHeader";
import { FormFooter } from "./ui/FormFooter";
import { Modal } from "../../ui";
import { FormController } from "./types";
import { FormTypeMap } from "../../../types/models";
import { Loader2 } from "lucide-react";
import { StepRenderer } from "./renderers/StepRenderer";

export const FormPresenter = <T extends keyof FormTypeMap>(
  props: FormController<T>,
) => {
  const { isOpen, close, isProcessing } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      header={<FormHeader {...props} />}
      footer={<FormFooter {...props} />}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center py-16">
          <div className="bg-gray-50 px-8 py-10 text-center">
            <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
          </div>
        </div>
      ) : (
        <StepRenderer {...props} />
      )}
    </Modal>
  );
};
