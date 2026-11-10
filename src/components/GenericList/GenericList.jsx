// لیست جدولی عمومی (هدر + ردیف + فیلترهای چندانتخابی + اسکرول بی‌نهایت + اسکلتون)؛ مناسب بخش‌هایی مثل تیکت‌ها و تراکنش‌ها که با type یا نوع دیتا، ستون‌ها و ردیف مخصوص همان بخش را نمایش می‌دهد

import styled, { css } from "styled-components";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { isValidJalaaliDate, toGregorian } from "jalaali-js";
import GenericListSkeleton from "../Skeletons/GenericListSkeleton";
import { getTranslation, isMobile } from "../../services/Utility";
import SearchInput from "../SearchInput";
import CustomDatePicker from "../CustomDatePicker";
import { getSize } from "../../styles/sizes";
import { LIST_CONFIG } from "./configs";

const responsiveFont = css`
  font-size: ${({ $size }) => getSize($size, "base")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }
`;
const LOAD_STEP = 10;

// حداقل ارتفاع جدول‌های فیلتردار تا منوی فیلتر با لیست خالی بریده نشود
const FILTER_MENU_MIN_HEIGHT = "380px";

// رنگ آیتم‌های فیلتر وضعیت
const VARIANTS = {
  success: { color: "#18c08f", bg: "#18c09017" },
  pending: { color: "#ffc800", bg: "#ffc80017" },
  failed: { color: "#ff0000", bg: "#ff000017" },
};

/* ----------------------------- Styles ----------------------------- */
const TableScroller = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  border-radius: 0.25rem;

  ${({ $hasFilter }) =>
    $hasFilter &&
    css`
      min-height: ${FILTER_MENU_MIN_HEIGHT};
    `}

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  min-height: 93vh;
  margin-top: 20px;
  border-radius: 0.25rem;

  @media (min-width: 840px) {
    min-height: 80vh !important;
  }

  @media (min-width: 1920px) {
    width: auto !important;
    min-height: 55vh;
  }
  ${({ $minHeight }) =>
    $minHeight &&
    css`
      min-height: ${$minHeight} !important;
    `}

  ${TableScroller} th,
  ${TableScroller} td {
    padding: 10px 12px;
  }

  ${TableScroller} th,
  ${TableScroller} td h2,
  ${TableScroller} td h3,
  ${TableScroller} td h4,
  ${TableScroller} td p,
  ${TableScroller} td span,
  ${TableScroller} td a,
  ${TableScroller} td button {
    ${responsiveFont}
  }

  @media (min-width: 500px) and (max-width: 999px) {
    ${TableScroller} th,
    ${TableScroller} td {
      padding: 12px 14px;
    }
  }

  @media (min-width: 1000px) {
    ${TableScroller} th,
    ${TableScroller} td {
      padding: 16px 18px;
    }
  }
`;

const Table = styled.table`
  width: max-content;
  min-width: 100%;
  margin-top: 5px;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-radius: 10px !important;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
`;

const TableHeader = styled.th`
  position: relative;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  ${responsiveFont}
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === "center" ? "center" : "start"};
  gap: 15px;
`;

const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const FilterMenu = styled.div`
  position: absolute;
  top: 65px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: max-content;
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};

  h1 {
    font-size: 16px;
    font-weight: 400;
    ${responsiveFont}

    &:first-of-type {
      margin: 3px 0;
    }
  }
`;

const OptionIcon = styled.img`
  width: 24px;
  height: 26px;
`;

const FilterOption = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 0 7px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s linear;

  ${({ $active, $variant, theme }) => {
    const { color, bg } = VARIANTS[$variant] ?? {
      color: theme.colors.newColors.primaryText,
      bg: theme.colors.shades[80],
    };

    return css`
      background-color: ${$active ? bg : "transparent"};
      color: ${$active ? color : "inherit"};

      &:hover {
        background-color: ${bg};
        color: ${color};
      }
    `;
  }}
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  padding-bottom: 10px;

  button {
    ${responsiveFont};
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const Sentinel = styled.div`
  width: 100%;
  height: 1px;
`;

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: ${({ $single }) =>
    $single ? "minmax(0, 1fr)" : "minmax(0, 3fr) minmax(0, 2fr)"};
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;

  @media (min-width: 1024px) {
    grid-template-columns: ${({ $single }) =>
      $single ? "minmax(0, 1fr)" : "minmax(0, 3fr) minmax(0, 1fr)"};
  }
`;

const normalizeDigits = (value) =>
  String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
    const code = digit.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });

const parseDate = (value) => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value !== "string" || !value.trim()) return null;

  const normalized = normalizeDigits(value.trim());
  if (/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(normalized)) {
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const dateParts = normalized.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);

  if (!dateParts) {
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  let [, year, month, day] = dateParts.map(Number);
  if (year < 1700) {
    if (!isValidJalaaliDate(year, month, day)) return null;
    ({ gy: year, gm: month, gd: day } = toGregorian(year, month, day));
  }

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  const timeParts = normalized.match(/(?:T|\s)(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (timeParts) {
    date.setHours(
      Number(timeParts[1]),
      Number(timeParts[2]),
      Number(timeParts[3] ?? 0),
      0,
    );
  }
  return date;
};

const startOfDay = (date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value.getTime();
};

const filterRowsByDate = (rows, dateKey, [start, end]) => {
  if (!dateKey || !start || !end) return rows;

  const firstDay = startOfDay(start);
  const lastDay = startOfDay(end);
  if (!Number.isFinite(firstDay) || !Number.isFinite(lastDay)) return rows;

  const from = Math.min(firstDay, lastDay);
  const to = new Date(Math.max(firstDay, lastDay));
  to.setDate(to.getDate() + 1);
  const toExclusive = to.getTime();

  return rows.filter((row) => {
    const date = parseDate(row?.[dateKey]);
    return date && date.getTime() >= from && date.getTime() < toExclusive;
  });
};

const resolveConfig = (type, rows) => {
  if (type && LIST_CONFIG[type]) return LIST_CONFIG[type];
  return (
    Object.values(LIST_CONFIG).find((cfg) => cfg.detect?.(rows?.[0])) || null
  );
};

// فیلتر سرچ + وضعیت بر اساس کانفیگ همون بخش (برای بخش‌های serverSide فیلتر نمی‌کند)
export const filterListRows = (type, rows, searched, status) => {
  const cfg = LIST_CONFIG[type];
  if (!cfg || cfg.serverSide) return rows;

  const activeKeys = Object.keys(cfg.statusValues).filter((k) => status[k]);

  return rows.filter((row) => {
    const searchMatch =
      !searched || row?.[cfg.searchKey]?.toString().includes(searched) || false;
    const statusMatch =
      activeKeys.length === 0 ||
      activeKeys.some((k) =>
        [].concat(cfg.statusValues[k]).includes(row.status),
      );
    return searchMatch && statusMatch;
  });
};

/* ---------------------------- Component --------------------------- */
const GenericList = ({
  type,
  variant, // مثلاً "sent" یا "received" برای لیست درخواست‌ها
  rows,
  status = {},
  setStatus,
  filters, // { status, title, subject }؛ اگر نباشد از status استفاده می‌شود
  setFilters, // { status: setStatus, title: setTitle, ... }
  isLoading,
  searchConfig,
  dateFilterConfig,
  loadMore,
  hasMore,
  isLoadMoreLoading,
  size = "default",

  ...rowExtraProps // domain, subdomain و ... به ردیف پاس داده میشن
}) => {
  const config = resolveConfig(type, rows);
  const serverSide = Boolean(config?.serverSide);

  const [visibleCount, setVisibleCount] = useState(LOAD_STEP);
  const [internalSearch, setInternalSearch] = useState("");
  const [internalDateRange, setInternalDateRange] = useState([null, null]);
  const [openFilter, setOpenFilter] = useState(null);
  const sentinelRef = useRef(null);
  const filterRef = useRef(null);

  const searchValue = searchConfig?.value ?? internalSearch;
  const dateRange = dateFilterConfig?.value ?? internalDateRange;
  const filteredRows = useMemo(() => {
    if (serverSide) return rows;

    let result = rows ?? [];
    if (searchConfig?.key && searchValue) {
      const query = searchValue.trim().toLocaleLowerCase();
      result = result.filter((row) =>
        String(row?.[searchConfig.key] ?? "")
          .toLocaleLowerCase()
          .includes(query),
      );
    }

    return filterRowsByDate(result, dateFilterConfig?.key, dateRange);
  }, [
    rows,
    serverSide,
    searchConfig?.key,
    searchValue,
    dateFilterConfig?.key,
    dateRange,
  ]);
  const canLoadMore =
    Boolean(hasMore) ||
    (!serverSide && visibleCount < (filteredRows?.length ?? 0));

  const handleLoadMore = useCallback(async () => {
    if (serverSide) return loadMore?.();

    if (loadMore && hasMore) {
      const loadedCount = await loadMore();
      setVisibleCount(
        (prev) =>
          prev + (typeof loadedCount === "number" ? loadedCount : LOAD_STEP),
      );
    } else {
      setVisibleCount((prev) => prev + LOAD_STEP);
    }
  }, [serverSide, loadMore, hasMore]);

  // بستن منوی فیلتر با کلیک بیرون
  useEffect(() => {
    if (!openFilter) return;

    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilter]);

  // اسکرول بی‌نهایت (فقط دسکتاپ)
  useEffect(() => {
    if (isMobile || isLoading || !canLoadMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isLoadMoreLoading) handleLoadMore();
      },
      { rootMargin: "200px", threshold: 0.1 },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [handleLoadMore, canLoadMore, isLoadMoreLoading, isLoading]);

  if (!config) return null;

  const { RowComponent, getRowProps } = config;
  const columns =
    typeof config.columns === "function"
      ? config.columns(variant)
      : config.columns;
  const visibleRows = serverSide ? rows : filteredRows.slice(0, visibleCount);
  const hasFilter = columns.some(({ filter }) => filter);

  const handleSearchChange = (value) => {
    if (searchConfig?.value === undefined) {
      setInternalSearch(value);
    }
    searchConfig?.onChange?.(value);
  };

  const handleDateChange = (value) => {
    if (dateFilterConfig?.value === undefined) {
      setInternalDateRange(value ?? [null, null]);
    }
    dateFilterConfig?.onChange?.(value);
  };

  // سازگار با VodList: اگر filters پاس داده نشود از status و setStatus استفاده می‌شود
  const getFilterState = (stateKey) =>
    filters?.[stateKey] ?? (stateKey === "status" ? status : {});

  const toggleFilter = (stateKey, optionKey) => {
    const setter =
      setFilters?.[stateKey] ?? (stateKey === "status" ? setStatus : undefined);
    setter?.((prev) => ({ ...prev, [optionKey]: !prev[optionKey] }));
  };

  const toggleMenu = (stateKey) =>
    setOpenFilter((current) => (current === stateKey ? null : stateKey));

  const renderFilter = ({ stateKey, options }) => {
    const state = getFilterState(stateKey);

    return (
      <FilterMenu $size={size}>
        {options.map(({ key, title, variant, icon }) => (
          <FilterOption
            key={key}
            $active={state[key]}
            $variant={variant}
            onClick={() => toggleFilter(stateKey, key)}
          >
            {icon && <OptionIcon src={icon} alt="" loading="lazy" />}
            <h1>{getTranslation(title)}</h1>
          </FilterOption>
        ))}
      </FilterMenu>
    );
  };

  const renderHeader = () => (
    <TableHead>
      <tr>
        {columns.map(({ title, filter, nowrap, width, align }) => {
          const isOpen = filter && openFilter === filter.stateKey;

          return (
            <TableHeader
              $size={size}
              key={title}
              ref={isOpen ? filterRef : null}
              style={{
                whiteSpace: nowrap ? "nowrap" : undefined,
                width,
                textAlign: align,
              }}
            >
              {filter ? (
                <>
                  <HeaderContent $align={align}>
                    {getTranslation(title)}
                    <Arrows onClick={() => toggleMenu(filter.stateKey)}>
                      <MdKeyboardArrowDown
                        style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
                      />
                    </Arrows>
                  </HeaderContent>
                  {isOpen && renderFilter(filter)}
                </>
              ) : (
                getTranslation(title)
              )}
            </TableHeader>
          );
        })}
      </tr>
    </TableHead>
  );

  return (
    <Container $minHeight={config.minHeight} $size={size}>
      {(searchConfig || dateFilterConfig) && (
        <Toolbar $single={!searchConfig || !dateFilterConfig}>
          {searchConfig && (
            <SearchInput
              placeholder={searchConfig.placeholder}
              value={searchValue}
              onchange={(event) => handleSearchChange(event.target.value)}
            />
          )}
          {dateFilterConfig && (
            <CustomDatePicker
              $size={size}
              placeholder={dateFilterConfig.placeholder}
              format={dateFilterConfig.format}
              plugins={dateFilterConfig.plugins}
              range
              value={dateRange}
              onChange={handleDateChange}
            />
          )}
        </Toolbar>
      )}
      <TableScroller $hasFilter={hasFilter}>
        <Table>
          {renderHeader()}
          <tbody>
            {isLoading ? (
              <GenericListSkeleton columns={columns} />
            ) : (
              visibleRows?.map((row, index) => (
                <RowComponent
                  key={row.id ?? index}
                  {...row}
                  {...rowExtraProps}
                  {...getRowProps?.(row, index, variant)}
                  isLoading={false}
                />
              ))
            )}
          </tbody>
        </Table>
      </TableScroller>

      {!isLoading && canLoadMore && (
        <>
          {isMobile ? (
            <Loader $size={size}>
              <button onClick={handleLoadMore} disabled={isLoadMoreLoading}>
                {isLoadMoreLoading
                  ? getTranslation(1824)
                  : getTranslation(1410)}
              </button>
            </Loader>
          ) : (
            <Sentinel ref={sentinelRef} />
          )}
        </>
      )}
    </Container>
  );
};

export default GenericList;
