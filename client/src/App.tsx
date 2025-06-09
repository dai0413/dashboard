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
import Player from "./pages/Player";
import Transfer from "./pages/Transfer";
import Injury from "./pages/Injury";
import Login from "./pages/Login";
import Me from "./pages/Me";
import { SortProvider } from "./context/sort-context";
import { FormProvider } from "./context/form-context";
import { Form } from "./components/modals/";
import { OptionsWrapper } from "./context/options-provider";
import { PlayerProvider } from "./context/player-context";
import { InjuryProvider } from "./context/injury-context";
import TransferDetail from "./pages/Detail/TransferDetail";
import InjuryDetail from "./pages/Detail/InjuryDetail";
import PlayerDetail from "./pages/Detail/PlayerDetail";

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <FilterProvider>
          <SortProvider>
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
                            path={APP_ROUTES.PLAYER}
                            element={
                              <Layout>
                                <Player />
                              </Layout>
                            }
                          />
                          <Route
                            path={`${APP_ROUTES.PLAYER}/:id`}
                            element={
                              <Layout>
                                <PlayerDetail />
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
                              // <PrivateRoute>
                              <Layout>
                                <Injury />
                              </Layout>
                              // </PrivateRoute>
                            }
                          />
                          <Route
                            path={`${APP_ROUTES.INJURY}/:id`}
                            element={
                              <Layout>
                                <InjuryDetail />
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
                      <OptionsWrapper>
                        <Form />
                      </OptionsWrapper>
                    </Router>
                  </FormProvider>
                </TransferProvider>
              </InjuryProvider>
            </PlayerProvider>
          </SortProvider>
        </FilterProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
