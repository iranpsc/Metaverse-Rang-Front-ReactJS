import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

export default function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigate();

  if (isLoggedIn()) {
    return navigation("/");
  }

  return children;
}
