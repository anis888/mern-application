import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login"; // Adjust path as needed
import Signup from "./components/Signup"; // Adjust path as needed
import EmployeeDashboard from "./pages/EmployeeDashboard"; // Adjust path as needed
import ManagerDashboard from "./pages/ManagerDashboard"; // Adjust path as needed

// ProtectedRoute component with role check
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    if (!decoded.id || !decoded.role) {
      localStorage.removeItem("token"); // Clear invalid token
      return <Navigate to="/login" replace />;
    }
    // Check if the user's role matches the required role
    if (decoded.role !== requiredRole) {
      return <Navigate to="/login" replace />; // Or redirect to a "forbidden" page
    }
    return children;
  } catch (err) {
    console.error("Invalid token:", err);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private Routes with Role Restrictions */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute requiredRole="employee">
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute requiredRole="manager">
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default Route: Redirect to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Catch-All Route: Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
