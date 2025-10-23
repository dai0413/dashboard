import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useMatchFormat } from "../../context/models/match-format";
import { ModelType } from "../../types/models";
import { MatchFormatGet } from "../../types/models/match-format";
import { periodField, periodOther } from "../../utils/displayField/periodField";

const MatchFormat = () => {
  const context = useMatchFormat();
  const { isOpen } = useForm();

  useEffect(() => {
    context.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"試合フォーマット情報"}
        headers={[
          { label: "大会名", field: "name", width: "150px" },
          {
            label: "前半",
            field: "1st",
            getData: (d: MatchFormatGet) => periodField(d, "前半"),
            width: "80px",
          },
          {
            label: "後半",
            field: "2nd",
            getData: (d: MatchFormatGet) => periodField(d, "前半"),
            width: "80px",
          },
          {
            label: "延前",
            field: "1ex",
            getData: (d: MatchFormatGet) => periodField(d, "延長前半"),
            width: "80px",
          },
          {
            label: "延後",
            field: "2ex",
            getData: (d: MatchFormatGet) => periodField(d, "延長後半"),
            width: "80px",
          },
          {
            label: "その他",
            field: "other",
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
          },
          {
            label: "PK",
            field: "pk",
            getData: (d: MatchFormatGet) => periodField(d, "PK"),
            width: "60px",
          },
        ]}
        contextState={context}
        modelType={ModelType.MATCH_FORMAT}
      />
    </div>
  );
};

export default MatchFormat;
