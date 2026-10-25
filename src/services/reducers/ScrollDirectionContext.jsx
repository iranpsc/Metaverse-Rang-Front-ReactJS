import { createContext, useState } from "react";

export const ScrollDirectionContext = createContext();

export const ScrollDirectionProvider = ({ children }) => {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isGlobalFullScreenMap, setisGlobalFullScreenMap] = useState(false);

  const updateScrollDirection = (value) => {
    setIsScrollingDown(value);
  };

  const setModalStatus = (status) => {
    setIsModalOpen(status);
  };

  const updateFullScreenMap = (status) => {
    setisGlobalFullScreenMap(status);
  };

  return (
    <ScrollDirectionContext.Provider 
      value={{ 
        isScrollingDown, 
        updateScrollDirection, 
        isModalOpen, 
        setModalStatus,
        isGlobalFullScreenMap,
        updateFullScreenMap 
      }}
    >
      {children}
    </ScrollDirectionContext.Provider>
  );
};
