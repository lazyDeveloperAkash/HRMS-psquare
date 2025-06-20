import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Auth from "./components/Auth/Auth";
import DashBoard from "./components/dashboard/DashBoard";
import PrivateRoutes from "./components/PrivateRoutes";
import "./App.css";
import Logo from "./components/Logo";
import { loadUser } from "./redux/slices/authSlice";
import { useEffect } from "react";

function App() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, []);
  
  if (loading)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Logo />
      </div>
    );

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Route */}
          <Route
            path="/"
            element={user ? <Navigate to="/dashboard" /> : <Auth />}
          />

          {/* Private Route */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoutes>
                <DashBoard />
              </PrivateRoutes>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
