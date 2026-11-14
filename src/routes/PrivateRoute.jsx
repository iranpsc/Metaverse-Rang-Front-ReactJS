import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth.js";

export default function PrivateRoute({ children }) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return children;
}