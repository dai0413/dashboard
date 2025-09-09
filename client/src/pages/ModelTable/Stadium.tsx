import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useStadium } from "../../context/models/stadium-context";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Stadium = () => {
  const stadiumContext = useStadium();
  const { isOpen } = useForm();

  useEffect(() => {
    stadiumContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"スタジアム情報"}
        headers={[
          { label: "名前", field: "name", width: "120px" },
          { label: "別名", field: "alt_names", width: "200px" },
          { label: "国", field: "country" },
        ]}
        contextState={stadiumContext}
        modelType={ModelType.STADIUM}
        linkField={[
          {
            field: "country",
            to: APP_ROUTES.NATIONAL_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Stadium;
