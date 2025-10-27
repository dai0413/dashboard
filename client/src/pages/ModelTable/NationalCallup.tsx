import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useNationalCallup } from "../../context/models/national-callup";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const NationalMatchSeries = () => {
  const context = useNationalCallup();
  const { isOpen } = useForm();

  useEffect(() => {
    context.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"代表招集リスト"}
        headers={[
          { label: "代表試合シリーズ", field: "series", width: "250px" },
          { label: "選手", field: "player" },
          { label: "招集状況", field: "status", width: "100px" },
          { label: "背番号", field: "number", width: "100px" },
          { label: "ポジション", field: "position_group", width: "100px" },
        ]}
        contextState={context}
        modelType={ModelType.NATIONAL_CALLUP}
        linkField={[
          {
            field: "series",
            to: APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY,
          },
          {
            field: "player",
            to: APP_ROUTES.PLAYER_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default NationalMatchSeries;
