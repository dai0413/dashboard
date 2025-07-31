import { PrivateRoute } from ".";
import { isDev } from "../../utils/env";

const wrapWithPrivateRoute = (element: React.ReactNode) => {
  return isDev ? element : <PrivateRoute>{element}</PrivateRoute>;
};

export default wrapWithPrivateRoute;
