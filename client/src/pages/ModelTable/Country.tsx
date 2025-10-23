import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useCountry } from "../../context/models/country";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Country = () => {
  const countryContext = useCountry();
  const { isOpen } = useForm();

  useEffect(() => {
    countryContext.metacrud.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"国情報"}
        headers={[
          { label: "国名", field: "name" },
          { label: "英名", field: "en_name" },
          { label: "地域", field: "area", width: "70px" },
        ]}
        contextState={countryContext}
        modelType={ModelType.COUNTRY}
        linkField={[
          {
            field: "name",
            to: APP_ROUTES.NATIONAL_SUMMARY,
          },
        ]}
      />
    </div>
  );
};

export default Country;
