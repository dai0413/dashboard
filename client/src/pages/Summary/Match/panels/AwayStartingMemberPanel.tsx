import { ModelType } from "../../../../types/models";
import { UseMatchSummary } from "../types";
import { DataViewContainer } from "../../../../components/dataView";
import { Formation } from "../../../../components/formation";

const AwayStartingMemberPanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      startingMember: { text, isLoading, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <DataViewContainer
        modelType={ModelType.PLAYER_APPEARANCE}
        fieldDefinitions={[]}
        items={items.away}
        totalCount={items.away.length}
        itemsLoading={isLoading}
        reloadFun={reloadFun}
        initialData={{
          formData: {
            match: id,
            team: selected?.away_team.id,
          },
          metaData: {
            match: [id],
            urls: selected.urls,
            date: selected.date,
            season: selected.season.id,
            competition_stage: selected.competition_stage.id,
          },
        }}
        renderView={() => <Formation datas={items.away} />}
      />
    </>
  );
};

export default AwayStartingMemberPanel;
