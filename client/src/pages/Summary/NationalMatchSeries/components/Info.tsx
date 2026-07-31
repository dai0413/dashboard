import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ModelType } from "../../../../types/models";
import { UseNationalMatchSeriesSummary } from "../types";
import { FullScreenLoader } from "../../../../components/ui";
import { useModal } from "../../../../context/modal-context";

const Info = ({ summary }: { summary: UseNationalMatchSeriesSummary }) => {
  const {
    detail: { open },
  } = useModal();
  const { selected, isLoading } = summary;
  return (
    <>
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.NATIONAL_MATCH_SERIES, selected._id);
              }}
            >
              {selected.name}
            </div>
            <div className="text-gray-600">{selected.country.label}</div>
            <div className="text-gray-600">{selected.team.label}</div>
            <div className="text-sm text-gray-500">
              {`${selected.joined_at && toDateKey(selected.joined_at)}~~~${
                selected.left_at && toDateKey(selected.left_at)
              }`}
            </div>
            <div className="text-sm text-gray-500">
              {selected.urls.map((url, index) => {
                return (
                  <a
                    key={`url-${index}`}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    link-{index + 1}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default Info;
