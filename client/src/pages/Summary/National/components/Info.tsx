import { FullScreenLoader } from "../../../../components/ui";
import { ModelType } from "../../../../types/models";
import { UseNationalSummary } from "../types";

const Info = ({ summary }: { summary: UseNationalSummary }) => {
  const { selected, isLoading } = summary;

  return (
    <>
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.COUNTRY, selected._id);
              }}
            >
              {selected.name}
            </div>
            <div className="text-gray-600">{selected.en_name}</div>
            <div className="text-sm text-gray-500">{selected.area}</div>
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default Info;
