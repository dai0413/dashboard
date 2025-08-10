import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { wrapWithPrivateRoute } from "../components/routes";

import { National, Player, Team } from "../pages/Summary";

export const Summary = (
  <>
    <Route
      path={`${APP_ROUTES.NATIONAL_SUMMARY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <National />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.PLAYER_SUMMARY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Player />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.TEAM_SUMMARY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Team />
        </Layout>
      )}
    />
  </>
);
