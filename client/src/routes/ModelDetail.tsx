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
  Season,
  Competition,
  TeamCompetitionSeason,
  Stadium,
  CompetitionStage,
  MatchFormat,
} from "../pages/ModelDetail/";

export const ModelDetail = (
  <>
    <Route
      path={`${APP_ROUTES.COMPETITION_STAGE}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <CompetitionStage />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.COMPETITION}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Competition />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.COUNTRY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Country />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.PLAYER}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Player />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.REFEREE}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Referee />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.SEASON}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Season />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.STADIUM}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Stadium />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.NATIONAL_CALLUP}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <NationalCallup />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.NATIONAL_MATCH_SERIES}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <NationalMatchSeries />
        </Layout>
      )}
    />

    <Route
      path={`${APP_ROUTES.TRANSFER}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Transfer />
        </Layout>
      )}
    />

    <Route
      path={`${APP_ROUTES.INJURY}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Injury />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.MATCH_FORMAT}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <MatchFormat />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.TEAM}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <Team />
        </Layout>
      )}
    />
    <Route
      path={`${APP_ROUTES.TEAM_COMPETITION_SEASON}/:id`}
      element={wrapWithPrivateRoute(
        <Layout>
          <TeamCompetitionSeason />
        </Layout>
      )}
    />
  </>
);
