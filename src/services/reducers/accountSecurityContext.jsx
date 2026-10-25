import { createContext, useState } from "react";

export const AccountSecurityContext = createContext();

export const AccountSecurityProvider = ({ children }) => {
  const [accountSecurity, setAccountSecurity] = useState(false);
  const [sectionId, setSectionId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  return (
    <AccountSecurityContext.Provider
      value={{
        accountSecurity,
        setAccountSecurity,
        sectionId,
        setSectionId,
        selectedItemId,
        setSelectedItemId,
      }}
    >      {children}
    </AccountSecurityContext.Provider>
  );
};
