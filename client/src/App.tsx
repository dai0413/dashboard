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
import Player from "./pages/Player";
import Transfer from "./pages/Transfer";
import Injury from "./pages/Injury";
import Team from "./pages/Team";
import Login from "./pages/Login";
import Me from "./pages/Me";
import { SortProvider } from "./context/sort-context";
import { FormProvider } from "./context/form-context";
import { Form } from "./components/modals/";
import { OptionsWrapper } from "./context/options-provider";
import { PlayerProvider } from "./context/models/player-context";
import { InjuryProvider } from "./context/models/injury-context";
import { TeamProvider } from "./context/models/team-context";
import TransferDetail from "./pages/Detail/TransferDetail";
import InjuryDetail from "./pages/Detail/InjuryDetail";
import PlayerDetail from "./pages/Detail/PlayerDetail";
import TeamDetail from "./pages/Detail/TeamDetail";
import { TopPageProvider } from "./context/top-page-context";

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
                              path={APP_ROUTES.PLAYER}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <PlayerProvider>
                                      <Player />
                                    </PlayerProvider>
                                  </Layout>
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path={`${APP_ROUTES.PLAYER}/:id`}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <PlayerProvider>
                                      <PlayerDetail />
                                    </PlayerProvider>
                                  </Layout>
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path={APP_ROUTES.TRANSFER}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <TransferProvider>
                                      <Transfer />
                                    </TransferProvider>
                                  </Layout>
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path={`${APP_ROUTES.TRANSFER}/:id`}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <TransferProvider>
                                      <TransferDetail />
                                    </TransferProvider>
                                  </Layout>
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path={APP_ROUTES.INJURY}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <InjuryProvider>
                                      <Injury />
                                    </InjuryProvider>
                                  </Layout>
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path={`${APP_ROUTES.INJURY}/:id`}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <InjuryProvider>
                                      <InjuryDetail />
                                    </InjuryProvider>
                                  </Layout>
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path={APP_ROUTES.TEAM}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <TeamProvider>
                                      <Team />
                                    </TeamProvider>
                                  </Layout>
                                </PrivateRoute>
                              }
                            />
                            <Route
                              path={`${APP_ROUTES.TEAM}/:id`}
                              element={
                                <PrivateRoute>
                                  <Layout>
                                    <TeamProvider>
                                      <TeamDetail />
                                    </TeamProvider>
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
