import { useAlert } from "../../../../context/alert-context";
import Alert from "../../../layout/Alert";
import { Modal } from "../../../ui";
import { DisplayListItem } from "../../../../types/detail";
import FieldList from "../../FieldList";

type CalendarDataDetailProps = {
  data: DisplayListItem[];
  title?: string;
  isOpen: boolean;
  close: () => void;
};

const CalendarDataDetail = ({
  data,
  title,
  isOpen,
  close,
}: CalendarDataDetailProps) => {
  const {
    modal: { alert, resetAlert },
  } = useAlert();

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      header={
        <div className="flex items-center gap-x-2 mb-4">
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
        </div>
      }
    >
      <Alert
        success={alert?.success || false}
        message={alert?.message}
        resetAlert={resetAlert}
      />

      <FieldList data={data} onClick={close} />
    </Modal>
  );
};

export default CalendarDataDetail;
