import { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { MdKeyboardArrowDown } from "react-icons/md";
import { getTranslation } from "../../services/Utility";

const DropdownContainer = styled.div`
  position: relative;
  width: ${({ $size }) => ($size === "small" ? "fit-content" : "100%")};
  min-width: ${({ $size }) => ($size === "small" ? "90px" : "0")};
  font-size: ${({ $size }) => ($size === "small" ? "14px" : "16px")};
  white-space: nowrap;
`;

const DropdownButton = styled.div`
  padding: ${({ $size }) => ($size === "small" ? "6px 10px" : "10px 12px")};
  border-radius: 5px;
  border: 1px solid #454545;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  color: #84858f;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ $size }) => ($size === "small" ? "8px" : "0")};
`;

const ArrowIcon = styled(MdKeyboardArrowDown)`
  font-size: ${({ $size }) => ($size === "small" ? "16px" : "20px")};
  flex-shrink: 0;
  color: #84858f;
  transition: transform 0.25s ease;
  ${({ $isOpen }) =>
    $isOpen &&
    css`
      transform: rotate(180deg);
    `}
`;

const DropdownList = styled.div`
  position: absolute;
  top: ${({ top }) => top || "110%"};
  left: 0;
  width: ${({ $size }) => ($size === "small" ? "max-content" : "100%")};
  min-width: 100%;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  border: 1px solid #454545;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: ${({ $size }) => ($size === "small" ? "6px 10px" : "10px 12px")};
  color: #84858f;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: ${({ theme }) => theme.colors.shades[80]};
  }
`;

const SearchInput = styled.input`
  width: 92%;
  font-size: ${({ $size }) => ($size === "small" ? "14px" : "16px")};
  padding: ${({ $size }) => ($size === "small" ? "6px 10px" : "10px 12px")};
  border: none;
  border-bottom: 1px solid #454545;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  color: #84858f;
  outline: none;
`;

const Dropdown = ({
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
  size = "normal", // "normal" | "small"
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (value) => {
    if (isControlled) {
      onOpenChange && onOpenChange(value);
    } else {
      setInternalIsOpen(value);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const optionsWithPlaceholder = selectPlaceHolder
    ? [placeholder, ...options]
    : options;

  const filteredOptions = searchable
    ? optionsWithPlaceholder.filter((option) =>
      (typeof option === "string" ? option : option.label)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    : optionsWithPlaceholder;

  const handleOptionClick = (option) => {
    const value = typeof option === "string" ? option : option.value;
    if (selectPlaceHolder && option === placeholder) {
      onSelect(null);
    } else {
      onSelect(value);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DropdownContainer ref={dropdownRef} $size={size}>
      {!hideTrigger && (
        <DropdownButton $size={size} onClick={() => setIsOpen(!isOpen)}>
          {(() => {
            if (!selected) return placeholder;
            const obj = options.find(
              (o) => typeof o === "object" && o.value === selected
            );
            return obj ? obj.label : selected;
          })()}
          <ArrowIcon $isOpen={isOpen} $size={size} />
        </DropdownButton>
      )}

      {isOpen && (
        <DropdownList top={top} $size={size}>
          {searchable && (
            <SearchInput
              $size={size}
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
              $size={size}
              onClick={() => handleOptionClick(option)}
            >
              {typeof option === "string" ? option : option.label}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </DropdownContainer>
  );
};

export default Dropdown;