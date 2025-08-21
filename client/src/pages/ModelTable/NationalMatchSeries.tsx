import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useNationalMatchSeries } from "../../context/models/national-match-series-context";
import { ModelType } from "../../types/models";

const NationalMatchSeries = () => {
  const nationalMatchSeriesContext = useNationalMatchSeries();
  const { isOpen } = useForm();

  useEffect(() => {
    nationalMatchSeriesContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"代表試合シリーズ情報"}
        headers={[
          { label: "名称", field: "name", width: "250px" },
          { label: "国名", field: "country", width: "100px" },
          { label: "年代", field: "team_class", width: "100px" },
          { label: "招集日", field: "joined_at" },
          { label: "解散日", field: "left_at" },
        ]}
        contextState={nationalMatchSeriesContext}
        modelType={ModelType.NATIONAL_MATCH_SERIES}
      />
    </div>
  );
};

export default NationalMatchSeries;
