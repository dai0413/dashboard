import CalendarDataDetail from "./CalendarDataDetail";
import ModelDataDetail from "./ModelDataDetail";
import { useModal } from "../../context/modal-context";

const DetailModal = () => {
  const { detail, calendarData, form } = useModal();

  return (
    <>
      <ModelDataDetail
        title={"詳細ページ"}
        modelType={detail.modelType}
        isOpen={detail.isOpen}
        id={detail.id}
        formOpen={form.open}
        close={detail.close}
      />
      <CalendarDataDetail
        data={calendarData.data}
        title={calendarData.title}
        isOpen={calendarData.isOpen}
        close={calendarData.close}
      />
    </>
  );
};

export default DetailModal;
