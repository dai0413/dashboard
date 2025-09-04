import { useCountry } from "../../context/models/country-context";
import { Detail } from "../../components/modals";
import { APP_ROUTES } from "../../lib/appRoutes";
import { ModelType } from "../../types/models";

const Country = () => {
  return (
    <Detail
      closeLink={APP_ROUTES.COUNTRY}
      modelType={ModelType.COUNTRY}
      modelContext={useCountry()}
      title="国詳細"
    />
  );
};

export default Country;
