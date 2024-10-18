import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Home from "./components/Home";
import LoginForm from "./components/LoginForm";
import Register from "./components/Register";
import GiveTask from "./pages/GiveTask";
import ViewTask from "./pages/ViewTask";
import About from "./pages/About";
import RegisteredUsers from "./pages/RegisteredUsers";
import Employee from "./pages/Employee";
import TaskList from "./pages/TaskList";

const App = () => {
  const current_theme = localStorage.getItem('current_theme');
  const [theme, setTheme] = useState(current_theme ? current_theme : 'light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    localStorage.setItem('current_theme', theme);
  }, [theme]);

  const handleSuccessfulLoginOrRegister = (role) => {
    setIsAuthenticated(true);
    localStorage.setItem('userRole', role); // Store the user role after successful login or registration
  };

  return (
    <Router>
      <div id="root" className={theme}>
        {isAuthenticated && (
          <Navbar theme={theme} setTheme={setTheme} setIsAuthenticated={setIsAuthenticated} />
        )}
        <Routes>
          <Route path="/" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register onRegister={handleSuccessfulLoginOrRegister} />} />
          <Route
            path="/home"
            element={
              isAuthenticated ? <ViewTask /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/givetask"
            element={
              isAuthenticated ? <GiveTask /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/viewtask"
            element={
              isAuthenticated ? <ViewTask /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/about"
            element={
              isAuthenticated ? <About /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/registeredusers"
            element={
              isAuthenticated ? <RegisteredUsers /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/employee"
            element={
              isAuthenticated ? <Employee /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/tasklist"
            element={
              isAuthenticated ? <TaskList /> : <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
