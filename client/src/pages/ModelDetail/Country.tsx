import { useCountry } from "../../context/models/country-context";
import { Detail } from "../../components/modals";
import { ModelType } from "../../types/models";

const CountryDetail = () => {
  return (
    <Detail
      modelType={ModelType.COUNTRY}
      modelContext={useCountry()}
      title="国詳細"
    />
  );
};

export default CountryDetail;
