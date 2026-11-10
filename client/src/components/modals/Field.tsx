import { FieldSettingModal } from "./FieldSettingModal";
import { DisplayFields } from "../../types/field";

type FieldProps = {
  fields: DisplayFields[];
  isOpen: boolean;
  handleClose: () => void;
  handleReset: () => void;
  handleUpdate: (fields: DisplayFields[]) => void;
};

const Field = ({
  fields,
  isOpen,
  handleClose,
  handleReset,
  handleUpdate,
}: FieldProps) => {
  return (
    <FieldSettingModal
      mode="field"
      fields={fields}
      isOpen={isOpen}
      onClose={handleClose}
      onReset={handleReset}
      updateFields={handleUpdate}
    />
  );
};

export default Field;
