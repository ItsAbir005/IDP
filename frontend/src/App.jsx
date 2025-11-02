import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useState, createContext, useContext, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import LogVitals from "./pages/LogVitals";
import ChatBot from "./pages/ChatBot";
import History from "./pages/History";
import GamifiedRewards from "./pages/Rewards";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Create Auth Context
export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    
    if (token && email) {
      setUser({ token, email, name });
      setLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    // ✅ Clear all user data on logout
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    setUser(null);
    setLoggedIn(false);
  };

  const ProtectedRoute = ({ children }) => {
    return loggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      <BrowserRouter>
        {/* Navigation Bar */}
        {loggedIn && (
          <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex space-x-8">
                  <Link to="/" className="hover:bg-blue-500 px-3 py-2 rounded-md font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/log" className="hover:bg-blue-500 px-3 py-2 rounded-md font-medium transition">
                    Log Vitals
                  </Link>
                  <Link to="/chat" className="hover:bg-blue-500 px-3 py-2 rounded-md font-medium transition">
                    Chat Bot
                  </Link>
                  <Link to="/history" className="hover:bg-blue-500 px-3 py-2 rounded-md font-medium transition">
                    History
                  </Link>
                  <Link to="/rewards" className="hover:bg-blue-500 px-3 py-2 rounded-md font-medium transition">
                    Rewards
                  </Link>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm">👋 {user?.name}</span>
                  <button
                    className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Page Routes */}
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
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
                  <GamifiedRewards />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all */}
            <Route path="*" element={<Navigate to={loggedIn ? "/" : "/login"} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;