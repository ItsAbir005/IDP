import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LogVitals from "./pages/LogVitals";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-blue-600 text-white p-3 flex gap-4">
        <Link to="/">Dashboard</Link>
        <Link to="/log">Log Vitals</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/log" element={<LogVitals />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
