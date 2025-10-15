import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LogVitals from "./pages/LogVitals";
import ChatBot from "./pages/ChatBot";
import History from "./pages/History";
import Rewards from "./pages/Rewards";
import Gamify from "./pages/Gamify";


function App() {
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-3 flex justify-center gap-8 shadow-md">
        <Link to="/" className="hover:text-gray-200 font-medium">Dashboard</Link>
        <Link to="/log" className="hover:text-gray-200 font-medium">Log Vitals</Link>
        <Link to="/chat" className="hover:text-gray-200 font-medium">Chat Bot</Link>
        <Link to="/history" className="hover:text-gray-200 font-medium">History</Link>
        <Link to="/rewards" className="hover:text-gray-200 font-medium">
          View Rewards
        </Link>
        <Link to="/gamify" className="hover:text-gray-200 font-medium">
          Gamify
        </Link>
      </nav>

      {/* Page Routes */}
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<LogVitals />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/history" element={<History />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/gamify" element={<Gamify />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
