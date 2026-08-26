import { useAlert } from "../../context/alert-context";
import Alert from "../layout/Alert";
import { Modal } from "../ui";
import { Fragment } from "react/jsx-runtime";
import { DisplayListItem } from "../../types/detail";
import RenderCell from "../table/RenderCell";

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
      onClose={() => close()}
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

      <div className="space-y-2 text-sm text-gray-700">
        {data.map((d) => {
          return (
            <Fragment key={d.id}>
              {d.displayGroup && (
                <div className="bg-gray-200 w-full p-1 rounded-lg">
                  <span className="font-bold">{d.group}</span>
                </div>
              )}
              <div
                key={d.id}
                className={[
                  "items-center border-b border-dotted py-1",
                  d.displayField ? "grid grid-cols-2" : "flex justify-end",
                ].join(" ")}
              >
                {d.displayField && (
                  <span className="font-semibold">{d.field}</span>
                )}

                <div className="flex justify-end items-center gap-4">
                  <RenderCell
                    value={d.value}
                    isRed={d.isRed}
                    onClick={() => close()}
                  />
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </Modal>
  );
};

export default CalendarDataDetail;
