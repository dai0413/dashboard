import { useCountry } from "../../context/models/country";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const Country = () => {
  return (
    <Detail
      modelType={ModelType.COUNTRY}
      modelContext={useCountry()}
      title="国詳細"
    />
  );
};

export default Country;
