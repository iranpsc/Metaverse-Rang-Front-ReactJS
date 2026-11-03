// کاستوم دراپ‌دان برای استفاده در تمام دراپ‌دان‌های پروژه
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import styled, { css } from "styled-components";

import { getTranslation } from "../../services/Utility";
import { responsiveFontSize } from "../../styles/sizes";
import TitleBody from "../TitleBody";

/* ---------- Constants ---------- */

const TEXT_COLOR = "#84858f";

const PADDING = {
  small: "6px 10px",
  default: "10px 12px",
  big: "12px 14px",
};

const ICON_SIZE = {
  small: "16px",
  default: "20px",
  big: "22px",
};

const getPadding = ({ $size }) => PADDING[$size] ?? PADDING.default;

/* ---------- Styles ---------- */

const DropdownContainer = styled.div`
  position: relative;
  width: ${({ $size }) => ($size === "small" ? "fit-content" : "100%")};
  min-width: ${({ $size }) => ($size === "small" ? "90px" : "0")};
  white-space: nowrap;
  ${responsiveFontSize}
`;

const DropdownButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ $size }) => ($size === "small" ? "8px" : "0")};
  padding: ${getPadding};
  border-radius: 5px;
  border: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  color: ${TEXT_COLOR};
  cursor: pointer;
`;

const ArrowIcon = styled(MdKeyboardArrowDown)`
  flex-shrink: 0;
  font-size: ${({ $size }) => ICON_SIZE[$size] ?? ICON_SIZE.default};
  color: ${TEXT_COLOR};
  transition: transform 0.25s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: rotate(180deg);
    `}
`;

const DropdownList = styled.div`
  position: absolute;
  top: ${({ $top }) => $top || "110%"};
  left: 0;
  z-index: 10;
  width: ${({ $size }) => ($size === "small" ? "max-content" : "100%")};
  min-width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 5px;
  border: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const DropdownItem = styled.div`
  padding: ${getPadding};
  color: ${TEXT_COLOR};
  cursor: pointer;

  &:hover {
    color: white;
    background-color: ${({ theme }) => theme.colors.shades[80]};
  }
`;

const SearchInput = styled.input`
  width: 92%;
  padding: ${getPadding};
  border: none;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  color: ${TEXT_COLOR};
  outline: none;
  ${responsiveFontSize}
`;

/* ---------- Helpers ---------- */

const getOptionLabel = (option) =>
  typeof option === "string" ? option : option.label;

const getOptionValue = (option) =>
  typeof option === "string" ? option : option.value;

/* ---------- Component ---------- */

const Dropdown = ({
  label,
  options = [],
  selected,
  top,
  onSelect,
  placeholder = "please select",
  searchable = false,
  selectPlaceHolder = false,
  hideTrigger = false,
  isOpen: controlledIsOpen,
  onOpenChange,
  size = "default", // "small" | "default" | "big" (مقدار قدیمی "normal" هم کار می‌کند)
}) => {
  const resolvedSize = size === "normal" ? "default" : size;

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (value) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalIsOpen(value);
  };

  const allOptions = selectPlaceHolder ? [placeholder, ...options] : options;

  const filteredOptions = searchable
    ? allOptions.filter((option) =>
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : allOptions;

  const selectedOption = options.find(
    (o) => typeof o === "object" && o.value === selected,
  );
  const triggerLabel = selected
    ? (selectedOption?.label ?? selected)
    : placeholder;

  const handleOptionClick = (option) => {
    const isPlaceholder = selectPlaceHolder && option === placeholder;
    onSelect(isPlaceholder ? null : getOptionValue(option));
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, isControlled, onOpenChange]);

  return (
    <div>
      {label && <TitleBody title={label} size={resolvedSize} />}

      <DropdownContainer ref={dropdownRef} $size={resolvedSize}>
        {!hideTrigger && (
          <DropdownButton
            $size={resolvedSize}
            onClick={() => setIsOpen(!isOpen)}
          >
            {triggerLabel}
            <ArrowIcon $isOpen={isOpen} $size={resolvedSize} />
          </DropdownButton>
        )}

        {isOpen && (
          <DropdownList $top={top} $size={resolvedSize}>
            {searchable && (
              <SearchInput
                $size={resolvedSize}
                type="text"
                placeholder={getTranslation("57")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            )}

            {filteredOptions.map((option, index) => (
              <DropdownItem
                key={index}
                $size={resolvedSize}
                onClick={() => handleOptionClick(option)}
              >
                {getOptionLabel(option)}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </DropdownContainer>
    </div>
  );
};

export default Dropdown;