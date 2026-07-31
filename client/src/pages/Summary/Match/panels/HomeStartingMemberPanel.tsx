import { ModelType } from "../../../../types/models";
import { UseMatchSummary } from "../types";
import { CustomTableContainer } from "../../../../components/table";
import { Formation } from "../../../../components/formation";

const HomeStartingMemberPanel = ({ summary }: { summary: UseMatchSummary }) => {
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
      <CustomTableContainer
        modelType={ModelType.PLAYER_APPEARANCE}
        fieldDefinitions={[]}
        pageNum={1}
        items={items.home}
        itemsLoading={isLoading}
        reloadFun={reloadFun}
        initialData={{
          formData: {
            match: id,
            team: selected?.home_team.id,
          },
          metaData: {
            match: [id],
            urls: selected.urls,
            date: selected.date,
            season: selected.season.id,
            competition_stage: selected.competition_stage.id,
          },
        }}
        renderView={() => <Formation datas={items.home} />}
      />
    </>
  );
};

export default HomeStartingMemberPanel;
