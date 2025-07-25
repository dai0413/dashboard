import { Route } from "react-router-dom";
import { APP_ROUTES } from "../lib/appRoutes";
import { Layout } from "../components/layout";
import { PrivateRoute } from "../components/routes";

import { Player } from "../pages/Summary";

export const Summary = (
  <>
    <Route
      path={`${APP_ROUTES.PLAYER_SUMMARY}/:id`}
      element={
        <PrivateRoute>
          <Layout>
            <Player />
          </Layout>
        </PrivateRoute>
      }
    />
  </>
);
