import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";

import Top from "./pages/Top";
import Transfer from "./pages/Transfer";
import Injury from "./pages/Injury";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App: React.FC = () => {
  return (
    <AuthProvider>
      {" "}
      <Router>
        {" "}
        {/* ルーティング設定 */}
        <div className="App">
          {/* ナビゲーションバー を後で追加*/}
          <Routes>
            <Route path="/" element={<Top />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/injury" element={<Injury />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
