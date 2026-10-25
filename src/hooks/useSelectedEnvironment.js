import { useContext } from "react";
import { SelectedEnvironmentContext } from "../services/reducers/SelectedEnvironmentContext";

export const useSelectedEnvironment = () =>
  useContext(SelectedEnvironmentContext);
