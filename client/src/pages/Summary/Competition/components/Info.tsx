import { SelectField } from "../../../../components/field";
import { FullScreenLoader } from "../../../../components/ui";
import { useModal } from "../../../../context/modal-context";
import { ModelType } from "../../../../types/models";
import { UseCompetitionSummary } from "../types";

const Info = ({ summary }: { summary: UseCompetitionSummary }) => {
  const {
    detail: { open },
  } = useModal();

  const { isLoading, selected } = summary;

  if (!summary.select) return;

  const { selectedOption, options, handleSelect } = summary.select;

  return (
    <>
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.COMPETITION, selected._id);
              }}
            >
              {selected.name}
            </div>
            <div className="w-full md:w-50">
              <SelectField
                type="text"
                value={selectedOption ? selectedOption?._id : ""}
                options={options}
                onChange={handleSelect}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div className="text-gray-600">{selected.en_name}</div>
            {selected.country.label ? (
              <div className="text-md text-gray-500">{`国：${selected.country.label}`}</div>
            ) : undefined}
            {selected.competition_type ? (
              <div className="text-md text-gray-500">{`大会タイプ：${selected.competition_type}`}</div>
            ) : undefined}
            {selected.category ? (
              <div className="text-md text-gray-500">{`カテゴリ：${selected.category}`}</div>
            ) : undefined}
            {selected.level ? (
              <div className="text-md text-gray-500">{`レベル：${selected.level}`}</div>
            ) : undefined}
            {selected.age_group ? (
              <div className="text-md text-gray-500">{`年代：${selected.age_group}`}</div>
            ) : undefined}
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default Info;
