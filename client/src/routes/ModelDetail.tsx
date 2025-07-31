import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { wrapWithPrivateRoute } from "../components/routes";

import TransferDetail from "../pages/ModelDetail/TransferDetail";
import InjuryDetail from "../pages/ModelDetail/InjuryDetail";
import PlayerDetail from "../pages/ModelDetail/PlayerDetail";
import TeamDetail from "../pages/ModelDetail/TeamDetail";

export const ModelDetail = (
  <>
    <Route
      path={`${APP_ROUTES.PLAYER}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <PlayerDetail />
        </Layout>
      )}
    />

    <Route
      path={`${APP_ROUTES.TRANSFER}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <TransferDetail />
        </Layout>
      )}
    />

    <Route
      path={`${APP_ROUTES.INJURY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <InjuryDetail />
        </Layout>
      )}
    />

    <Route
      path={`${APP_ROUTES.TEAM}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <TeamDetail />
        </Layout>
      )}
    />
  </>
);
