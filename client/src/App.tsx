import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./lib/appRoutes";
import { AuthProvider } from "./context/auth-context";
import { AlertProvider } from "./context/alert-context";
import { FilterProvider } from "./context/filter-context";
import { Layout } from "./components/layout";
import { PrivateRoute, wrapWithPrivateRoute } from "./components/routes";

import Top from "./pages/Top";
import Login from "./pages/Login";
import Me from "./pages/Me";
import { SortProvider } from "./context/sort-context";
import { FormProvider } from "./context/form-context";
import { Form } from "./components/modals/";
import { OptionProvider } from "./context/options-provider";
import { TopPageProvider } from "./context/top-page-context";
import { ModelWrapper } from "./context/models/model-wrapper";

import { ModelTable, ModelDetail, Summary } from "./routes";
import NoNumber from "./pages/NoNumber";
import AdminDashboard from "./pages/AdminDashboard";

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
                    <div className="App">
                      <Routes>
                        {ModelTable}
                        {ModelDetail}
                        {Summary}
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
                      </Routes>
                    </div>
                    <Form />
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
