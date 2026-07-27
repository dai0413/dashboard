import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TableWithFetch } from "../../components/table";
import { useCountry } from "../../context/models/country";
import { ModelType } from "../../types/models";
import { FullScreenLoader } from "../../components/ui";
import { fieldDefinition } from "../../lib/model-fields";
import { isFilterable, isSortable } from "../../types/field";
import { API_PATHS } from "@dai0413/myorg-shared";
import { APP_ROUTES } from "../../lib/appRoutes";
import { useModal } from "../../context/modal-context";
import { SummaryTabItems } from "../../types/menu/IconButton";
import SummaryTabMenu from "./components/SummaryTabMenu";
import { convertFieldDefinition } from "../../utils/displayField/convertFieldDefinition";

const tabItems: SummaryTabItems[] = [
  {
    icon: "competition",
    key: "competition",
    text: "大会",
  },
  {
    icon: "team",
    key: "team",
    text: "代表チーム",
  },
];

const competitionFieldDefinition =
  convertFieldDefinition<ModelType.COMPETITION>(
    ["name", "competition_type", "category", "age_group"],
    fieldDefinition[ModelType.COMPETITION],
  );

const teamFieldDefinition = convertFieldDefinition<ModelType.TEAM>(
  ["normalized_name", "abbr", "enTeam", "country", "age_group"],
  fieldDefinition[ModelType.TEAM],
);

const National = () => {
  const { id } = useParams();
  const {
    detail: { open },
    form: { isOpen: formIsOpen },
  } = useModal();

  const [selectedTab, setSelectedTab] = useState("competition");

  const {
    metacrud: { selected, readItem, isLoading },
  } = useCountry();

  useEffect(() => {
    if (!id) return;
    (async () => {
      await readItem(id);
    })();
  }, [id, formIsOpen]);

  const handleSelectedTab = (
    value: string | number | Date | undefined,
  ): void => {
    setSelectedTab(value as string);
  };

  return (
    <div className="p-6">
      {/* Header情報 */}
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

      <SummaryTabMenu
        items={tabItems}
        selectedTab={selectedTab}
        onChange={handleSelectedTab}
      />

      {/* コンテンツ表示 */}
      {selectedTab === "competition" && id && (
        <TableWithFetch
          modelType={ModelType.COMPETITION}
          fieldDefinitions={competitionFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.COMPETITION.ROOT,
            params: { getAll: true, country: id, sort: "_id" },
          }}
          filterField={competitionFieldDefinition
            ?.filter(isFilterable)
            .filter((file) => file.key !== "country")}
          sortField={competitionFieldDefinition
            ?.filter(isSortable)
            .filter((file) => file.key !== "country")}
          linkField={[
            {
              field: "name",
              to: APP_ROUTES.COMPETITION_SUMMARY,
            },
          ]}
          initialData={{
            formData: {
              country: id,
            },
          }}
        />
      )}

      {selectedTab === "team" && id && (
        <TableWithFetch
          modelType={ModelType.TEAM}
          fieldDefinitions={teamFieldDefinition}
          fetch={{
            apiRoute: API_PATHS.TEAM.ROOT,
            params: {
              getAll: true,
              genre: "national",
              country: id,
              sort: "age_group",
            },
          }}
          filterField={teamFieldDefinition?.filter(isFilterable)}
          sortField={teamFieldDefinition?.filter(isSortable)}
          linkField={[
            {
              field: "normalized_name",
              to: APP_ROUTES.TEAM_SUMMARY,
            },
          ]}
        />
      )}
    </div>
  );
};

export default National;
