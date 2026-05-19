import { useFormController } from "./hooks/useFormController";
import { FormPresenter } from "./FormPresenter";
import { FormTypeMap } from "../../../types/models";

export const FormContainer = <T extends keyof FormTypeMap>() => {
  const controller = useFormController<T>();

  if (!controller.formSteps?.length) return null;

  return <FormPresenter {...controller} />;
};
