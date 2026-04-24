import { ModelTableContainer } from "../../components/table";
import { useCountry } from "../../context/models/country";
import { ModelType } from "../../types/models";
import { APP_ROUTES } from "../../lib/appRoutes";

const Country = () => {
  const countryContext = useCountry();

  return (
    <div className="p-6">
      <ModelTableContainer
        title={"国情報"}
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
