import { toDateKey } from "@dai0413/myorg-shared/normalizer";
import { ModelType } from "../../../../types/models";
import { UseMatchSummary } from "../types";
import { FullScreenLoader } from "../../../../components/ui";
import { useModal } from "../../../../context/modal-context";
import { getLinkFields } from "../../../../lib/model-link-fields";
import { convertToDisplayListData } from "../../../../components/modals/Detail/utils/convertToDisplayListData ";
import { matchRelatedItems } from "../../../AdminDashboard/data";
import { FormMode, InputMode, StartFormArgs } from "../../../../types/types";
import { ActionButtonList } from "../../../../components/buttons/ActionButtonList";
import { useMemo } from "react";

const linkField = getLinkFields(ModelType.MATCH);

const Info = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    detail: { open },
  } = useModal();
  const { isLoading, selected } = summary;

  const actionButtonItems = useMemo(() => {
    return matchRelatedItems
      .filter(
        (i) =>
          "updateAndCreate" in i.startFormArgs &&
          i.startFormArgs.updateAndCreate,
      )
      .map((item) => {
        if (!selected || !("_id" in selected)) return;

        const startFormArgs: StartFormArgs<ModelType.MATCH> = {
          ...item.startFormArgs,
          modelType: ModelType.MATCH,
          formMode: FormMode.UPDATE,
          inputMode: InputMode.MANY,
          editItem: [selected],
          ids: [selected._id],
          initialData: {
            metaData: {
              // card_ids: [selected?._id],
              match: selected?._id,
              competition: selected?.competition.id,
              home_team: selected?.home_team.id,
              away_team: selected?.away_team.id,
              season: selected?.season.id,
              competition_stage: selected?.competition_stage.id,
              match_week: selected?.match_week,
            },
          },
        };

        return {
          ...item,
          startFormArgs,
          formModelType: ModelType.MATCH,
        };
      })
      .filter((item) => item !== undefined);
  }, [matchRelatedItems, selected]);

  return (
    <>
      {!isLoading && selected ? (
        <div className="border-b pb-2">
          <div className="flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
              <div
                className="font-bold text-lg underline hover:text-blue-600 cursor-pointer"
                onClick={() => {
                  open(
                    ModelType.MATCH,
                    selected._id,
                    convertToDisplayListData({
                      data: selected,
                      model: { modelType: ModelType.MATCH, linkField },
                    }),
                  );
                }}
              >
                {`${selected.home_team.label}-${selected.away_team.label}`}
              </div>
              <div className="text-gray-600">{selected.competition.label}</div>
              {selected.competition_stage && (
                <div className="text-gray-600">
                  {selected.competition_stage.label}
                </div>
              )}
              {selected.match_week && (
                <div className="text-gray-600">{`第${selected.match_week}節`}</div>
              )}
              <div className="text-sm text-gray-500">
                開催日：{toDateKey(selected.date)}
              </div>
            </div>

            <ActionButtonList items={actionButtonItems} />
          </div>
        </div>
      ) : (
        <FullScreenLoader />
      )}
    </>
  );
};

export default Info;
