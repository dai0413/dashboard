import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { PrivateRoute } from "../components/routes";

import TransferDetail from "../pages/ModelDetail/TransferDetail";
import InjuryDetail from "../pages/ModelDetail/InjuryDetail";
import PlayerDetail from "../pages/ModelDetail/PlayerDetail";
import TeamDetail from "../pages/ModelDetail/TeamDetail";

export const ModelDetail = (
  <>
    <Route
      path={`${APP_ROUTES.PLAYER}/:id`}
      element={
        <PrivateRoute>
          <Layout>
            <PlayerDetail />
          </Layout>
        </PrivateRoute>
      }
    />

    <Route
      path={`${APP_ROUTES.TRANSFER}/:id`}
      element={
        <PrivateRoute>
          <Layout>
            <TransferDetail />
          </Layout>
        </PrivateRoute>
      }
    />

    <Route
      path={`${APP_ROUTES.INJURY}/:id`}
      element={
        <PrivateRoute>
          <Layout>
            <InjuryDetail />
          </Layout>
        </PrivateRoute>
      }
    />

    <Route
      path={`${APP_ROUTES.TEAM}/:id`}
      element={
        <PrivateRoute>
          <Layout>
            <TeamDetail />
          </Layout>
        </PrivateRoute>
      }
    />
  </>
);
