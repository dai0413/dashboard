import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./lib/appRoutes";
import { ModelWrapper } from "./context/models/model-wrapper";
import { AuthProvider } from "./context/auth-context";
import { AlertProvider } from "./context/alert-context";
import { FilterProvider } from "./context/filter-context";
import { SortProvider } from "./context/sort-context";
import { FormProvider } from "./context/form-context";
import { OptionProvider } from "./context/options-provider";
import { TopPageProvider } from "./context/top-page-context";
import { QueryProvider } from "./context/query-context";

import { PrivateRoute, wrapWithPrivateRoute } from "./components/routes";
import { Form } from "./components/modals/";
import { Layout } from "./components/layout";
import Top from "./pages/Top";
import Login from "./pages/Login";
import Me from "./pages/Me";
import NoNumber from "./pages/NoNumber";
import AdminDashboard from "./pages/AdminDashboard";
import NoCallUp from "./pages/NoCallup";
import { ModelTable, ModelDetail, Summary } from "./routes";

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <ModelWrapper>
          <OptionProvider>
            <FilterProvider>
              <SortProvider>
                <FormProvider>
                  <Router>
                    <QueryProvider>
                      <div className="App">
                        <Routes>
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
                            path={APP_ROUTES.NO_NUMBER}
                            element={wrapWithPrivateRoute(
                              <Layout>
                                <NoNumber />
                              </Layout>
                            )}
                          />
                          <Route
                            path={APP_ROUTES.NO_CALLUP}
                            element={wrapWithPrivateRoute(
                              <Layout>
                                <NoCallUp />
                              </Layout>
                            )}
                          />
                          {ModelTable}
                          {ModelDetail}
                          {Summary}
                        </Routes>
                      </div>
                      <Form />
                    </QueryProvider>
                  </Router>
                </FormProvider>
              </SortProvider>
            </FilterProvider>
          </OptionProvider>
        </ModelWrapper>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
