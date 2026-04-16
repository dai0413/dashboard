import { ModelTableContainer } from "../../components/table";
import { useFormation } from "../../context/models/formation";
import { ModelType } from "../../types/models";
import { FormationGet } from "../../types/models/formation";
import { position_formation } from "@dai0413/myorg-shared";
import { ColumnType, TableHeader } from "../../types/table";

const getData = (data: FormationGet, position: string): string => {
  return data.position_formation.findIndex((f) => f === position) > -1
    ? "◯"
    : "";
};

const positions = position_formation();
const fields = positions.map((p) => ({
  type: ColumnType.CUSTOM,
  id: p.key,
  label: p.key,
  getData: (data: FormationGet) => getData(data, p.key),
  width: "70px",
})) satisfies TableHeader<FormationGet>[];

const Formation = () => {
  const formationContext = useFormation();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"フォーメーション情報"}
        headers={[
          {
            label: "名前",
            field: "name",
            width: "100px",
            id: "name",
            type: ColumnType.FIELD,
          },
          ...fields,
        ]}
        contextState={formationContext}
        modelType={ModelType.FORMATION}
      />
    </div>
  );
};

export default Formation;
