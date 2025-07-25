import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./lib/appRoutes";
import { AuthProvider } from "./context/auth-context";
import { AlertProvider } from "./context/alert-context";
import { FilterProvider } from "./context/filter-context";
import { TransferProvider } from "./context/models/transfer-context";
import { Layout } from "./components/layout";
import { PrivateRoute } from "./components/routes";

import Top from "./pages/Top";
import Login from "./pages/Login";
import Me from "./pages/Me";
import { SortProvider } from "./context/sort-context";
import { FormProvider } from "./context/form-context";
import { Form } from "./components/modals/";
import { OptionsWrapper } from "./context/options-provider";
import { PlayerProvider } from "./context/models/player-context";
import { InjuryProvider } from "./context/models/injury-context";
import { TeamProvider } from "./context/models/team-context";
import { TopPageProvider } from "./context/top-page-context";

import { ModelTable, ModelDetail, Summary } from "./routes";

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <FilterProvider>
          <SortProvider>
            <TeamProvider>
              <PlayerProvider>
                <InjuryProvider>
                  <TransferProvider>
                    <OptionsWrapper>
                      <FormProvider>
                        <Router>
                          <div className="App">
                            <Routes>
                              {ModelTable}
                              {ModelDetail}
                              {Summary}
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
                            </Routes>
                          </div>
                          <Form />
                        </Router>
                      </FormProvider>
                    </OptionsWrapper>
                  </TransferProvider>
                </InjuryProvider>
              </PlayerProvider>
            </TeamProvider>
          </SortProvider>
        </FilterProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
