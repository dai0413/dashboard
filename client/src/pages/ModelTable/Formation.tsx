import { useEffect } from "react";
import { ModelTableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useFormation } from "../../context/models/formation";
import { ModelType } from "../../types/models";
import { FormationGet } from "../../types/models/formation";
import { position_formation } from "@dai0413/myorg-shared";

const getData = (data: FormationGet, position: string): string => {
  return data.position_formation.findIndex((f) => f === position) > -1
    ? "◯"
    : "";
};

const positions = position_formation();
const fields = positions.map((p) => {
  return {
    label: p.key,
    field: p.key,
    getData: (data: FormationGet) => getData(data, p.key),
    width: "70px",
  };
});

const Formation = () => {
  const formationContext = useFormation();
  const { isOpen } = useForm();

  useEffect(() => {
    formationContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"フォーメーション情報"}
        headers={[{ label: "名前", field: "name", width: "100px" }, ...fields]}
        contextState={formationContext}
        modelType={ModelType.FORMATION}
      />
    </div>
  );
};

export default Formation;
