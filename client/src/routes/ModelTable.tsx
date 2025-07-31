import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { wrapWithPrivateRoute } from "../components/routes";

import Player from "../pages/ModelTable/Player";
import Transfer from "../pages/ModelTable/Transfer";
import Injury from "../pages/ModelTable/Injury";
import Team from "../pages/ModelTable/Team";

export const ModelTable = (
  <>
    <Route
      path={APP_ROUTES.PLAYER}
      element={wrapWithPrivateRoute(
        <Layout>
          <Player />
        </Layout>
      )}
    />
    <Route
      path={APP_ROUTES.TRANSFER}
      element={wrapWithPrivateRoute(
        <Layout>
          <Transfer />
        </Layout>
      )}
    />
    <Route
      path={APP_ROUTES.INJURY}
      element={wrapWithPrivateRoute(
        <Layout>
          <Injury />
        </Layout>
      )}
    />

    <Route
      path={APP_ROUTES.TEAM}
      element={wrapWithPrivateRoute(
        <Layout>
          <Team />
        </Layout>
      )}
    />
  </>
);
