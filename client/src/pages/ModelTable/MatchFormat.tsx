import { ModelTableContainer } from "../../components/table";
import { useMatchFormat } from "../../context/models/match-format";
import { ModelType } from "../../types/models";
import { MatchFormatGet } from "../../types/models/match-format";
import { ColumnType } from "../../types/table";
import { periodField, periodOther } from "../../utils/displayField/periodField";

const MatchFormat = () => {
  const context = useMatchFormat();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"試合フォーマット情報"}
        headers={[
          {
            label: "大会名",
            field: "name",
            width: "150px",
            type: ColumnType.FIELD,
            id: "name",
            defaultDisplay: true,
          },
          {
            label: "前半",
            id: "1st",
            defaultDisplay: true,
            getData: (d: MatchFormatGet) => periodField(d, "前半"),
            width: "80px",
            type: ColumnType.CUSTOM,
          },
          {
            label: "後半",
            id: "2nd",
            defaultDisplay: true,
            getData: (d: MatchFormatGet) => periodField(d, "前半"),
            width: "80px",
            type: ColumnType.CUSTOM,
          },
          {
            label: "延前",
            id: "1ex",
            defaultDisplay: true,
            getData: (d: MatchFormatGet) => periodField(d, "延長前半"),
            width: "80px",
            type: ColumnType.CUSTOM,
          },
          {
            label: "延後",
            id: "2ex",
            defaultDisplay: true,
            getData: (d: MatchFormatGet) => periodField(d, "延長後半"),
            width: "80px",
            type: ColumnType.CUSTOM,
          },
          {
            label: "その他",
            id: "other",
            defaultDisplay: true,
            getData: (d: MatchFormatGet) =>
              periodOther(d, [
                "前半",
                "後半",
                "延長前半",
                "延長後半",
                "PK",
                "ゴールデンボール",
              ]),
            width: "80px",
            type: ColumnType.CUSTOM,
          },
          {
            label: "PK",
            id: "pk",
            defaultDisplay: true,
            getData: (d: MatchFormatGet) => periodField(d, "PK"),
            width: "60px",
            type: ColumnType.CUSTOM,
          },
        ]}
        contextState={context}
        modelType={ModelType.MATCH_FORMAT}
      />
    </div>
  );
};

export default MatchFormat;
