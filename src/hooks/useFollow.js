import { useContext } from "react";
import { FollowContext } from "../services/reducers/FollowContext";

export const useFollow = () => useContext(FollowContext);
