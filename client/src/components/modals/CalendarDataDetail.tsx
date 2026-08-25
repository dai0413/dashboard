import { Link } from "react-router-dom";
import { useAlert } from "../../context/alert-context";
import Alert from "../layout/Alert";
import { Modal } from "../ui";
import { CalendarDetailItem } from "../table/Calendar/types";
import { Fragment } from "react/jsx-runtime";

type CalendarDataDetailProps = {
  data: CalendarDetailItem[];
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
        {data.map((d, i) => {
          const key = typeof d.value === "object" ? d.value.to : d.value;
          const displayGroupLabel = i === 0 || data[i - 1]?.group !== d.group;
          const displayField = i === 0 || data[i - 1]?.field !== d.field;

          return (
            <Fragment key={`${d.group}-${d.field ?? ""}-${key}-${i}`}>
              {displayGroupLabel && (
                <div className="bg-gray-200 w-full">
                  <span className="font-bold">{d.group}</span>
                </div>
              )}
              <div
                key={key}
                className={[
                  "items-center border-b border-dotted py-1",
                  displayField ? "grid grid-cols-2" : "flex justify-end",
                ].join(" ")}
              >
                {displayField && (
                  <span className="font-semibold">{d.field}</span>
                )}

                <div className="flex justify-end items-center gap-4">
                  {d.value.to ? (
                    <Link
                      onClick={() => close()}
                      to={d.value.to}
                      className="hover:text-blue-600 underline"
                    >
                      {d.value.label}
                    </Link>
                  ) : (
                    <span
                      className={d.isRed ? "text-red-500 font-semibold" : ""}
                    >
                      {d.value.label}
                    </span>
                  )}
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
