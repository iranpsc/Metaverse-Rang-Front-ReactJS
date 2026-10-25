import { useContext } from "react";
import { AccountSecurityContext } from "../services/reducers/accountSecurityContext";

export const useAccountSecurity = () => useContext(AccountSecurityContext);
