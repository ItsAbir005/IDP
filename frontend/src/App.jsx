import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import LogVitals from "./pages/LogVitals";
import ChatBot from "./pages/ChatBot";
import History from "./pages/History";
import Rewards from "./pages/Rewards";
import Gamify from "./pages/Gamify";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
  };

  const ProtectedRoute = ({ children }) => {
    return loggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      {loggedIn && (
        <nav className="bg-blue-600 text-white p-3 flex justify-center gap-8 shadow-md">
          <Link to="/" className="hover:text-gray-200 font-medium">
            Dashboard
          </Link>
          <Link to="/log" className="hover:text-gray-200 font-medium">
            Log Vitals
          </Link>
          <Link to="/chat" className="hover:text-gray-200 font-medium">
            Chat Bot
          </Link>
          <Link to="/history" className="hover:text-gray-200 font-medium">
            History
          </Link>
          <Link to="/rewards" className="hover:text-gray-200 font-medium">
            View Rewards
          </Link>
          <Link to="/gamify" className="hover:text-gray-200 font-medium">
            Gamify
          </Link>
          <button
            className="ml-4 bg-red-500 px-2 py-1 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>
      )}

      {/* Page Routes */}
      <div className="p-6">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/log"
            element={
              <ProtectedRoute>
                <LogVitals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gamify"
            element={
              <ProtectedRoute>
                <Gamify />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
