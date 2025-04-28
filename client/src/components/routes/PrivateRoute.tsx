import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { APP_ROUTES } from "../../lib/appRoutes";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAuth();

  return accessToken ? children : <Navigate to={APP_ROUTES.LOGIN} />;
};

export default PrivateRoute;
