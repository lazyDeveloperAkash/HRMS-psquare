import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    // User not logged in → redirect to /
    return <Navigate to="/" />;
  }

  return children; // User is logged in → allow route
}