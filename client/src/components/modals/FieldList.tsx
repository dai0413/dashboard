import { Fragment } from "react";
import { DisplayListItem } from "../../types/detail";
import RenderCell from "../table/RenderCell";

type Props = {
  data: DisplayListItem[];
  isForm?: boolean;
  onClick?: () => void;
};

const FieldList = ({ data, isForm, onClick }: Props) => {
  return (
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
                  isLink={d.isLink}
                  onClick={onClick}
                />
                {isForm && d.onEdit && (
                  <button
                    className="font-semibold hover:underline"
                    onClick={d.onEdit}
                  >
                    編集
                  </button>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default FieldList;
