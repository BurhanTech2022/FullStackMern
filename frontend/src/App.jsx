// import { useQuery } from "@tanstack/react-query";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import { Routes, Route, Navigate } from "react-router-dom";

// import Task from "./Task";

function App() {
 
  return (
    
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    
  );
}

export default App;
