import { createContext, useState } from "react";

export const MenuContext = createContext();

export const MenuContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuContext.Provider value={{ isOpen, toggleMenu }}>
      {children}
    </MenuContext.Provider>
  );
};
