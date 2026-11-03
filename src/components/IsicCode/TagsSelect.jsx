// انتخاب چندتایی با جستجو: تگ‌های انتخاب‌شده + اینپوت + لیست پیشنهادها (با اسکرول بی‌نهایت)
import { useEffect, useMemo, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import styled from "styled-components";

const SCROLL_THRESHOLD = 40;

// یکسان‌سازی ی/ک عربی و فارسی برای مقایسه
const normalize = (text) =>
  (text || "")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const Root = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  min-height: 50px;
      border: 1px solid ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  padding: 8px 15px;
  padding-inline-end: 40px;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  svg {
    flex-shrink: 0;
    font-size: 24px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-width: 0;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  min-width: 100px;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;

  font-size: 16px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 14px;
  font-size: 13px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
  border: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
`;

const RemoveButton = styled.button`
  display: flex;
  padding: 0;
  border: none;
  background: none;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.otherColors.red};
`;

const ToggleButton = styled.button`
  position: absolute;
  inset-inline-end: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  font-size: 22px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const List = styled.ul`
  position: absolute;
  top: calc(100% + 4px);
  inset-inline: 0;
  z-index: 20;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
`;

const Item = styled.li`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  &:hover {
    background-color: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
  }
`;

const Status = styled.li`
  padding: 8px 12px;
  font-size: 13px;
  text-align: center;
  opacity: 0.7;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

/**
 * value: string[]                       آیتم‌های انتخاب‌شده
 * onChange(nextValue: string[])
 * options: { id, label }[]              پیشنهادها
 * loading                               نمایش "..." ته لیست
 * max                                   سقف تعداد انتخاب
 * allowCustom                           با Enter مقدار دلخواه اضافه بشه
 * onSearchChange(term)                  بعد از debounce صدا زده میشه
 * onOpenChange(isOpen)                  وقتی لیست باز/بسته میشه (برای فعال/غیرفعال کردن fetch)
 * onLoadMore()                          وقتی ته لیست رسید
 */
const TagsSelect = ({
  value = [],
  onChange,
  options = [],
  loading = false,
  max = 3,
  maxInputLength = 25,
  debounceMs = 400,
  allowCustom = true,
  placeholder,
  emptyText = "—",
  onSearchChange,
  onOpenChange,
  onLoadMore,
  
}) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);

  const isLimitReached = value.length >= max;
  const isListOpen = isOpen && !isLimitReached;

  // debounce جستجو
  useEffect(() => {
    const t = setTimeout(() => onSearchChange?.(input.trim()), debounceMs);
    return () => clearTimeout(t);
  }, [input, debounceMs, onSearchChange]);

  useEffect(() => {
    onOpenChange?.(isListOpen);
  }, [isListOpen, onOpenChange]);

  // بستن با کلیک بیرون
  useEffect(() => {
    const onMouseDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // وقتی سقف پر شد لیست بسته بمونه
  useEffect(() => {
    if (isLimitReached) setIsOpen(false);
  }, [isLimitReached]);

  const availableOptions = useMemo(() => {
    const selected = value.map(normalize);
    return options.filter((o) => !selected.includes(normalize(o.label)));
  }, [options, value]);

  const add = (raw) => {
    const next = (raw || "").trim();
    if (!next || isLimitReached) return;
    if (value.some((v) => normalize(v) === normalize(next))) return;

    onChange([...value, next]);
    setInput("");
  };

  const remove = (index) => onChange(value.filter((_, i) => i !== index));

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (allowCustom) add(input);
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
      onLoadMore?.();
    }
  };

  return (
    <Root ref={rootRef}>
      <Row>
        <FiSearch />

        {value.map((item, index) => (
          <Tag key={`${item}-${index}`}>
            {item}
            <RemoveButton
              type="button"
              aria-label="remove"
              onClick={() => remove(index)}
            >
              ×
            </RemoveButton>
          </Tag>
        ))}

        {!isLimitReached && (
          <Input
            value={input}
            maxLength={maxInputLength}
            placeholder={value.length === 0 ? placeholder : ""}
            onChange={(e) => {
              setInput(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
          />
        )}
      </Row>

      <ToggleButton
        type="button"
        disabled={isLimitReached}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        +
      </ToggleButton>

      {isListOpen && (
        <List onScroll={handleScroll}>
          {availableOptions.map((option) => (
            <Item
              key={option.id}
              onClick={() => {
                add(option.label);
                setIsOpen(false);
              }}
            >
              {option.label}
            </Item>
          ))}
          {loading && <Status>...</Status>}
          {!loading && availableOptions.length === 0 && (
            <Status>{emptyText}</Status>
          )}
        </List>
      )}
    </Root>
  );
};

export default TagsSelect;