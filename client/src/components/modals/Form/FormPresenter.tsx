import { FormHeader } from "./ui/FormHeader";
import { FormFooter } from "./ui/FormFooter";
import { StepRenderer } from "./renderers/StepRenderer";
import { Modal } from "../../ui";
import { FormController } from "./types";
import { FormTypeMap } from "../../../types/models";

export const FormPresenter = <T extends keyof FormTypeMap>(
  props: FormController<T>,
) => {
  const { isOpen, close } = props;

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      header={<FormHeader {...props} />}
      footer={<FormFooter {...props} />}
    >
      <StepRenderer {...props} />
    </Modal>
  );
};
