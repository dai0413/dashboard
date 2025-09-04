import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { wrapWithPrivateRoute } from "../components/routes";

import {
  Competition,
  National,
  NationalMatchSeries,
  Player,
  Team,
} from "../pages/Summary";

export const Summary = (
  <>
    <Route
      path={`${APP_ROUTES.COMPETITION_SUMMARY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Competition />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.NATIONAL_SUMMARY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <National />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.NATIONAL_MATCH_SERIES_SUMMARY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <NationalMatchSeries />
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
