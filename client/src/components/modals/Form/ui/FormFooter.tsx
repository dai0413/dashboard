import { FormTypeMap } from "../../../../types/models";
import { LinkButtonGroup } from "../../../buttons";

type FormFooter<T extends keyof FormTypeMap> = {
  deny?: {
    color?: "green" | "red" | "gray" | undefined;
    text: string;
    onClick: () => void;
  };

  approve?: {
    color?: "green" | "red" | "gray" | undefined;
    text: string;
    onClick: () => void;
  };
};

export const FormFooter = <T extends keyof FormTypeMap>({
  deny,
  approve,
}: FormFooter<T>) => {
  return (
    <div>
      <LinkButtonGroup approve={approve} deny={deny} />
    </div>
  );
};
