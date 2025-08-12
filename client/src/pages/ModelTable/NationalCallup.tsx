import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useNationalCallup } from "../../context/models/national-callup";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const NationalMatchSeries = () => {
  const context = useNationalCallup();
  const { isOpen } = useForm();

  useEffect(() => {
    context.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"代表招集リスト"}
        headers={[
          { label: "代表試合シリーズ", field: "series" },
          { label: "選手", field: "player" },
          { label: "招集状況", field: "status" },
          { label: "背番号", field: "number" },
          { label: "ポジション", field: "position" },
        ]}
        contextState={context}
        modelType={ModelType.NATIONAL_CALLUP}
        summaryLinkField={{
          field: "player",
          to: APP_ROUTES.PLAYER_SUMMARY,
        }}
      />
    </div>
  );
};

export default NationalMatchSeries;
