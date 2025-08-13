import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Login from "./components/Login";
import Navbar from "./components/Navbar";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const handleLogin = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navbar token={token} user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Dashboard token={token} user={user} onLogout={handleLogout} />} />
        <Route path="/admin" element={<Admin token={token} user={user} onLogout={handleLogout} />} />
      </Routes>
    </div>
  );
}

export default App;
