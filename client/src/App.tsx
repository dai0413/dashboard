import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./lib/appRoutes";
import { AuthProvider } from "./context/auth-context";
import { AlertProvider } from "./context/alert-context";
import { FilterProvider } from "./context/filter-context";
import { TransferProvider } from "./context/transfer-context";
import { Layout } from "./components/layout";
import { PrivateRoute } from "./components/routes";

import Top from "./pages/Top";
import Transfer from "./pages/Transfer";
import Injury from "./pages/Injury";
import Login from "./pages/Login";
import Me from "./pages/Me";
import TransferDetail from "./pages/TransferDetail";
import { SortProvider } from "./context/sort-context";
import { FormProvider } from "./context/form-context";
import { Form } from "./components/modals/";
import { OptionsWrapper } from "./context/options-provider";

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <FilterProvider>
          <SortProvider>
            <TransferProvider>
              <FormProvider>
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
                        path={APP_ROUTES.TRANSFER}
                        element={
                          // <PrivateRoute>
                          <Layout>
                            <Transfer />
                          </Layout>
                          // </PrivateRoute>
                        }
                      />
                      <Route
                        path={`${APP_ROUTES.TRANSFER}/:id`}
                        element={
                          <Layout>
                            <TransferDetail />
                          </Layout>
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
                        path={APP_ROUTES.ME}
                        element={
                          <PrivateRoute>
                            <Layout>
                              <Me />
                            </Layout>
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </div>
                  <OptionsWrapper>
                    <Form />
                  </OptionsWrapper>
                </Router>
              </FormProvider>
            </TransferProvider>
          </SortProvider>
        </FilterProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
