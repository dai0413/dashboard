import { ModelType } from "../../../../types/models";
import { TableClient } from "../../../../components/dataView";
import { isFilterable, isSortable } from "../../../../types/field";
import { UseMatchSummary } from "../types";
import { APP_ROUTES } from "../../../../lib/appRoutes";
import { playerAppearanceFieldDefinition } from "../constants/field";
import { ViewMode } from "../../../../types/types";

const AwaySubMemberPanel = ({ summary }: { summary: UseMatchSummary }) => {
  const {
    id,
    selected,
    panels: {
      awaySubMember: { isLoading, text, key, items, reloadFun },
    },
  } = summary;

  if (!selected) return;

  return (
    <>
      <div className="text-gray-600">{text}</div>
      <TableClient
        key={key}
        itemsLoading={isLoading}
        modelType={ModelType.PLAYER_APPEARANCE}
        fieldDefinitions={playerAppearanceFieldDefinition}
        viewModes={[ViewMode.TABLE, ViewMode.TILE]}
        viewData={{
          [ViewMode.TABLE]: items,
          [ViewMode.TILE]: items,
        }}
        totalCount={items.length}
        reloadFun={reloadFun}
        filterField={playerAppearanceFieldDefinition
          ?.filter(isFilterable)
          .filter((file) => file.key !== "match" && file.key !== "team")}
        sortField={playerAppearanceFieldDefinition
          ?.filter(isSortable)
          .filter((file) => file.key !== "match" && file.key !== "team")}
        linkField={[
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
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
      />
    </>
  );
};

export default AwaySubMemberPanel;
