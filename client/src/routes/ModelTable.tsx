import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { PrivateRoute } from "../components/routes";

import Player from "../pages/ModelTable/Player";
import Transfer from "../pages/ModelTable/Transfer";
import Injury from "../pages/ModelTable/Injury";
import Team from "../pages/ModelTable/Team";

export const ModelTable = (
  <>
    <Route
      path={APP_ROUTES.PLAYER}
      element={
        <PrivateRoute>
          <Layout>
            <Player />
          </Layout>
        </PrivateRoute>
      }
    />
    <Route
      path={APP_ROUTES.TRANSFER}
      element={
        <PrivateRoute>
          <Layout>
            <Transfer />
          </Layout>
        </PrivateRoute>
      }
    />
    <Route
      path={APP_ROUTES.INJURY}
      element={
        <PrivateRoute>
          <Layout>
            <Injury />
          </Layout>
        </PrivateRoute>
      }
    />

    <Route
      path={APP_ROUTES.TEAM}
      element={
        <PrivateRoute>
          <Layout>
            <Team />
          </Layout>
        </PrivateRoute>
      }
    />
  </>
);
