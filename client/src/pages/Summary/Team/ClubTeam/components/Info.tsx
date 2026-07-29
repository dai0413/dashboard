import { ModelType } from "../../../../../types/models";
import { SelectField } from "../../../../../components/field";
import { FullScreenLoader } from "../../../../../components/ui";
import { useModal } from "../../../../../context/modal-context";
import { UseClubTeamSummary } from "../types";

const Info = ({ summary }: { summary: UseClubTeamSummary }) => {
  const {
    detail: { open },
  } = useModal();

  const {
    info: {
      selected,
      teamCompetitionSeason,
      selectedteamCompetitionSeason,
      seasonOptions,
      handleSetSelectedSeason,
    },
  } = summary;

  return (
    <>
      {!teamCompetitionSeason.isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
            <div
              className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
              onClick={() => {
                open(ModelType.TEAM, selected._id);
              }}
            >
              {selected.team}
            </div>
            <div className="w-full md:w-50">
              <SelectField
                type="text"
                value={
                  selectedteamCompetitionSeason
                    ? selectedteamCompetitionSeason?._id
                    : ""
                }
                options={seasonOptions}
                onChange={handleSetSelectedSeason}
                defaultOption={
                  seasonOptions.length > 0 ? undefined : "登録シーズンなし"
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            <div className="text-gray-600">{`${selected.enTeam}`}</div>
            <div className="text-gray-600">{`略称：${selected.abbr}`}</div>
            <div className="text-sm text-gray-500">
              {`国：${selected.country.label}`}
            </div>
            <div className="text-sm text-gray-500">
              {`ジャンル：${selected.genre}`}
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
