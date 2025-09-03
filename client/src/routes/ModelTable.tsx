import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { wrapWithPrivateRoute } from "../components/routes";
import {
  Transfer,
  Injury,
  Player,
  Team,
  Country,
  NationalMatchSeries,
  NationalCallup,
  Referee,
  Competition,
  Season,
  TeamCompetitionSeason,
} from "../pages/ModelTable/";

export const ModelTable = (
  <>
    <Route
      path={APP_ROUTES.COMPETITION}
      element={wrapWithPrivateRoute(
        <Layout>
          <Competition />
        </Layout>
      )}
    />
    <Route
      path={APP_ROUTES.COUNTRY}
      element={wrapWithPrivateRoute(
        <Layout>
          <Country />
        </Layout>
      )}
    />
    <Route
      path={APP_ROUTES.PLAYER}
      element={wrapWithPrivateRoute(
        <Layout>
          <Player />
        </Layout>
      )}
    />
    <Route
      path={APP_ROUTES.REFEREE}
      element={wrapWithPrivateRoute(
        <Layout>
          <Referee />
        </Layout>
      )}
    />
    <Route
      path={APP_ROUTES.SEASON}
      element={wrapWithPrivateRoute(
        <Layout>
          <Season />
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
      path={APP_ROUTES.NATIONAL_CALLUP}
      element={wrapWithPrivateRoute(
        <Layout>
          <NationalCallup />
        </Layout>
      )}
    />
    <Route
      path={APP_ROUTES.NATIONAL_MATCH_SERIES}
      element={wrapWithPrivateRoute(
        <Layout>
          <NationalMatchSeries />
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
    <Route
      path={APP_ROUTES.TEAM_COMPETITION_SEASON}
      element={wrapWithPrivateRoute(
        <Layout>
          <TeamCompetitionSeason />
        </Layout>
      )}
    />
  </>
);
