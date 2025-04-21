import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { APP_ROUTES } from "./lib/appRoutes";
import { AuthProvider } from "./context/auth-context";
import { AlertProvider } from "./context/alert-context";
import PrivateRoute from "./components/PrivateRoute";

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
              <Route path={APP_ROUTES.HOME} element={<Top />} />
              <Route path={APP_ROUTES.LOGIN} element={<Login />} />
              <Route path={APP_ROUTES.REGISTER} element={<Register />} />

              <Route
                path={APP_ROUTES.TRANSFER}
                element={
                  <Transfer />
                  // <PrivateRoute>
                  //   <Transfer />
                  // </PrivateRoute>
                }
              />
              <Route
                path={APP_ROUTES.INJURY}
                element={
                  <Injury />
                  // <PrivateRoute>
                  //   <Injury />
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
