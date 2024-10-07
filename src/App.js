import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/pages/Login/Login";
import Signup from "./components/pages/Signup/Signup";
import TodoList from "./components/pages/TodoList/TodoList";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // If token exists, set isAuthenticated to true
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-blue-600 text-white py-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">To-Do Application</h1>
            {/* Conditionally render either login/signup buttons or navigation bar */}
            {!isAuthenticated ? (
              <div>
                <Link to="/login">
                  <button className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="ml-4 bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300">
                    Sign Up
                  </button>
                </Link>
              </div>
            ) : (
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link
                      to="/tasks"
                      className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition duration-300"
                    >
                      My Tasks
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </header>

        <main className="container mx-auto py-8 flex-grow">
          <Routes>
            {/* Protect routes if not authenticated */}
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/signup" element={<Signup />} />
            {isAuthenticated ? (
              <Route path="/tasks" element={<TodoList />} />
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>

        <footer className="bg-blue-600 text-white py-4 text-center">
          <p>© 2024 To-Do App. All Rights Reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
