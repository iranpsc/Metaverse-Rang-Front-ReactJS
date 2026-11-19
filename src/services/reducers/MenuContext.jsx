import { createContext, useContext, useState } from "react";

const MenuContext = createContext();

export const useMenuContext = () => useContext(MenuContext);

export const MenuContextProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isHiddenOnMobile, setHiddenOnMobile] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <MenuContext.Provider
      value={{ isOpen, toggleMenu, isHiddenOnMobile, setHiddenOnMobile }}
    >
      {children}
    </MenuContext.Provider>
  );
};
