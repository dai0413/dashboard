import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./lib/appRoutes";
import { AuthProvider } from "./context/auth-context";
import { AlertProvider } from "./context/alert-context";
import { Layout, PrivateRoute } from "./components/index";

import Top from "./pages/Top";
import Transfer from "./pages/Transfer";
import Injury from "./pages/Injury";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <Router>
          {/* ルーティング設定 */}
          <div className="App">
            {/* ナビゲーションバー を後で追加*/}
            <Routes>
              <Route
                path={APP_ROUTES.HOME}
                element={
                  <Layout>
                    <Top />
                  </Layout>
                }
              />
              <Route
                path={APP_ROUTES.LOGIN}
                element={
                  <Layout>
                    <Login />
                  </Layout>
                }
              />
              <Route
                path={APP_ROUTES.REGISTER}
                element={
                  <Layout>
                    <Register />
                  </Layout>
                }
              />

              <Route
                path={APP_ROUTES.TRANSFER}
                element={
                  <Layout>
                    <Transfer />
                  </Layout>
                  // <PrivateRoute>
                  //   <Layout>
                  //   <Transfer />
                  // </Layout>
                  // </PrivateRoute>
                }
              />
              <Route
                path={APP_ROUTES.INJURY}
                element={
                  <Layout>
                    <Injury />
                  </Layout>
                  // <PrivateRoute>
                  //   <Layout>
                  //   <Injury />
                  // </Layout>
                  // </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
