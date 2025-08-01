import { useEffect } from "react";
import { TableContainer } from "../../components/table";
import { useForm } from "../../context/form-context";
import { useCountry } from "../../context/models/country-context";
import { ModelType } from "../../types/models";

const Country = () => {
  const countryContext = useCountry();
  const { isOpen } = useForm();

  useEffect(() => {
    countryContext.readItems({});
  }, [isOpen]);

  return (
    <div className="p-6">
      <TableContainer
        title={"国情報"}
        headers={[
          { label: "国名", field: "name" },
          { label: "英名", field: "en_name" },
          { label: "地域", field: "area" },
        ]}
        contextState={countryContext}
        modelType={ModelType.COUNTRY}
      />
    </div>
  );
};

export default Country;
