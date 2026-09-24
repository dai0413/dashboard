import { ModelType } from "../../../../types/models";
import { UseMatchSummary } from "../types";
import { DataViewContainer } from "../../../../components/dataView";
import { ViewMode } from "../../../../types/types";
import { playerAppearanceFieldDefinition } from "../constants/field";
import { convertToFormationItem } from "../../../../utils/data/convertToFormationItem";

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
        fieldDefinitions={playerAppearanceFieldDefinition}
        items={items.away}
        totalCount={items.away.length}
        newItemsPerPage={11}
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
        viewModes={[ViewMode.TABLE, ViewMode.TILE, ViewMode.FORMATION]}
        defaultViewMode={ViewMode.FORMATION}
        viewData={{
          [ViewMode.TABLE]: items.away,
          [ViewMode.TILE]: items.away,
          [ViewMode.FORMATION]: convertToFormationItem(items.away),
        }}
      />
    </>
  );
};

export default AwayStartingMemberPanel;
