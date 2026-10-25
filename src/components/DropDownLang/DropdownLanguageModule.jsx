// کامپوننت لیست انتخاب زبان (Dropdown) برای نمایش زبان‌های موجود همراه با آیکون پرچم و نام بومی هر زبان.
import { useEffect, useRef } from "react";
import styled from "styled-components";
const Menu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
`;

const Item = styled.li`
  display: flex;
  gap: 10px;
  width: 100%;
  padding: 6px 0;
  cursor: pointer;
`;

const Name = styled.p`
  max-width: 200px;
  overflow: hidden;
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : "#858585"};

  ${Item}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function DropdownLanguageModule({
  langArray,
  changeLanguage,
  currentLang,
  setIsLangOpen,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsLangOpen]);

  const handleSelect = (code) => {
    changeLanguage(code);
    setIsLangOpen(false);
  };

  return (
    <Menu ref={menuRef}>
      {langArray?.map(({ id, code, icon, native_name }) => (
        <Item key={id} onClick={() => handleSelect(code)}>
          <img src={icon} alt={native_name} width={28} height={28} />
          <Name $selected={currentLang === code}>{native_name}</Name>
        </Item>
      ))}
    </Menu>
  );
}
