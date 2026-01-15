import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./lib/appRoutes";
import { ModelWrapper } from "./context/models/model-wrapper";
import { AuthProvider } from "./context/auth-context";
import { AlertProvider } from "./context/alert-context";
import { FormProvider } from "./context/form-context";
import { OptionProvider } from "./context/options-provider";
import { TopPageProvider } from "./context/top-page-context";
import { QueryProvider } from "./context/query-context";
import { ModalProvider } from "./context/modal-context";

import { PrivateRoute, wrapWithPrivateRoute } from "./components/routes";
import { Layout } from "./components/layout";
import Top from "./pages/Top";
import Login from "./pages/Login";
import Me from "./pages/Me";
import NoNumber from "./pages/NoNumber";
import AdminDashboard from "./pages/AdminDashboard";
import NoCallUp from "./pages/NoCallup";
import NotFound from "./pages/NotFound";
import models from "./pages/Models";
import Modal from "./pages/Modal";
import { Summary } from "./routes";

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <ModalProvider>
          <ModelWrapper>
            <OptionProvider>
              <FormProvider>
                <BrowserRouter>
                  <QueryProvider>
                    <div className="App">
                      <Routes>
                        {Object.entries(models).map(
                          ([key, { table: Table }]) => (
                            <Route
                              path={`/${key}/*`}
                              element={wrapWithPrivateRoute(
                                <Layout>
                                  <Table />
                                </Layout>
                              )}
                            />
                          )
                        )}

                        <Route
                          path={APP_ROUTES.ADMIN}
                          element={wrapWithPrivateRoute(
                            <Layout>
                              <AdminDashboard />
                            </Layout>
                          )}
                        />
                        <Route
                          path={APP_ROUTES.HOME}
                          element={
                            <Layout>
                              <TopPageProvider>
                                <Top />
                              </TopPageProvider>
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
                          path={APP_ROUTES.ME}
                          element={
                            <PrivateRoute>
                              <Layout>
                                <Me />
                              </Layout>
                            </PrivateRoute>
                          }
                        />
                        <Route
                          path={`/${APP_ROUTES.NO_NUMBER}/*`}
                          element={wrapWithPrivateRoute(
                            <Layout>
                              <NoNumber />
                            </Layout>
                          )}
                        />

                        <Route
                          path={`/${APP_ROUTES.NO_CALLUP}/*`}
                          element={wrapWithPrivateRoute(
                            <Layout>
                              <NoCallUp />
                            </Layout>
                          )}
                        />

                        {Summary}

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <Modal />
                  </QueryProvider>
                </BrowserRouter>
              </FormProvider>
            </OptionProvider>
          </ModelWrapper>
        </ModalProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
