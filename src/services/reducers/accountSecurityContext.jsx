import { createContext, useContext, useState, lazy, Suspense } from "react";

const AccountSecurityModal = lazy(() => import("../../pages/AccountSecurity"));

const Education = lazy(() => import("../../pages/Education/Education"));

const AccountSecurityContext = createContext(null);

export const useAccountSecurity = () => useContext(AccountSecurityContext);

export const AccountSecurityProvider = ({ children }) => {
  const [isAccountSecurityOpen, setIsAccountSecurityOpen] = useState(false);
  const [educationData, setEducationData] = useState(null);
  const [educationTitle, setEducationTitle] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const closeAccountSecurity = () => setIsAccountSecurityOpen(false);

  const openEducation = (data, title) => {
    setEducationData(data);
    setEducationTitle(title);
  };

  return (
    <AccountSecurityContext.Provider
      value={{
        isAccountSecurityOpen,
        setIsAccountSecurityOpen,
        sectionId,
        setSectionId,
        selectedItemId,
        setSelectedItemId,
      }}
    >
      {children}

      <Suspense fallback={null}>
        {isAccountSecurityOpen && (
          <AccountSecurityModal
            onClose={closeAccountSecurity}
            onReportClick={closeAccountSecurity}
            onHelpClick={openEducation}
          />
        )}

        {educationData && (
          <Education
            adviserData={educationData}
            title={educationTitle}
            overlayZIndex={2147483646}
            setOpenEducation={(isOpen) => {
              if (!isOpen) {
                setEducationData(null);
                setEducationTitle(null);
              }
            }}
          />
        )}
      </Suspense>
    </AccountSecurityContext.Provider>
  );
};
