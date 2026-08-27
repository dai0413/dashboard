import { ModelTableContainer } from "../../components/table";
import { useCountry } from "../../context/models/country";
import { ModelType } from "../../types/models";

const Country = () => {
  const countryContext = useCountry();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"国情報"}
        contextState={countryContext}
        modelType={ModelType.COUNTRY}
      />
    </div>
  );
};

export default Country;
