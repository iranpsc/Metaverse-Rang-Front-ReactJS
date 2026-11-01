// لیست جدولی عمومی (هدر + ردیف + فیلترهای چندانتخابی + اسکرول بی‌نهایت + اسکلتون)؛ مناسب بخش‌هایی مثل تیکت‌ها و تراکنش‌ها که با type یا نوع دیتا، ستون‌ها و ردیف مخصوص همان بخش را نمایش می‌دهد

import styled, { css } from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import VodRow from "../../pages/Documents/Tabs/DocsList/VodRow";
import TransactionRow from "../../pages/Profile/Tabs/transactions-tab/TransactionRow";
import { Skeleton } from "../Skeleton";
import { COLOR_CONFIG } from "../../services/constants/colorConfig";
import { getTranslation, isMobile } from "../../services/Utility";
import RequestRow from "../../pages/Profile/Tabs/dynasty/components/RequestRow";
import ReportRow from "../../pages/Report/reports/ReportsListTab/ReportRow";
const LOAD_STEP = 10;

const gif = (key) => COLOR_CONFIG[key].gif;
const skeleton = (width = "100px", height = "16px", radius = "4px") => ({
  width,
  height,
  radius,
});

// رنگ آیتم‌های فیلتر وضعیت
const VARIANTS = {
  success: { color: "#18c08f", bg: "#18c09017" },
  pending: { color: "#ffc800", bg: "#ffc80017" },
  failed: { color: "#ff0000", bg: "#ff000017" },
};

/* ----------------------------- Styles ----------------------------- */
const Container = styled.div`
  min-height: 93vh;
  margin-top: 20px;
  overflow-x: auto;
  border-radius: 0.25rem;

  &::-webkit-scrollbar {
    display: none;
  }

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
`;

const Table = styled.table`
  width: 100%;
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
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  @media (max-width: 1024px) {
    padding: 16px;
    font-size: 15px;
  }

  @media (max-width: 950px) {
    padding: 13px;
  }
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

const SkeletonRow = styled.tr`
  td {
    padding: 15px 20px;
    border-bottom: 1px solid #454545;
  }
`;

const SkeletonCell = styled(Skeleton)`
  margin-right: auto;
  margin-left: auto;
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  padding-bottom: 10px;

  button {
    border: none;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const Sentinel = styled.div`
  width: 100%;
  height: 1px;
`;

/* ----------------------------- Config ----------------------------- */
const STATUS_OPTIONS = [
  { key: "confirmed", title: "1343" },
  { key: "pending", title: "1373" },
  { key: "failed", title: "1345" },
  { key: "read", title: "1346" },
];

const LIST_CONFIG = {
  tickets: {
    RowComponent: VodRow,
    // تشخیص خودکار وقتی type پاس داده نشده
    detect: (row) => row && "code" in row && "sender" in row,
    // مقدار(های) عددی status برای هر فیلتر؛ می‌تونه عدد یا آرایه باشه
    statusValues: { pending: 0, confirmed: 1, read: 4, failed: 5 },
    // فیلد متنی که سرچ روی اون انجام میشه
    searchKey: "title",
    columns: [
      { title: "1339", skeleton: skeleton("60px") },
      { title: "1319", skeleton: skeleton("200px") },
      { title: "1340", skeleton: skeleton("200px") },
      {
        title: "1341",
        filter: { stateKey: "status", options: STATUS_OPTIONS },
        skeleton: skeleton("80px"),
      },
      { title: "64", nowrap: true, skeleton: skeleton("120px") },
      { title: "1342", skeleton: skeleton("40px", "40px", "8px") },
    ],
  },

  transactions: {
    RowComponent: TransactionRow,
    // فیلتر و صفحه‌بندی سمت سرور انجام می‌شود، پس فیلتر و slice محلی غیرفعال است
    serverSide: true,
    getRowProps: (row, index) => ({
      paymentReturned:
        sessionStorage.getItem("payment_returned") === "true" && index === 0,
    }),
    columns: [
      { title: "63", skeleton: skeleton() },
      { title: "64", width: "235px", skeleton: skeleton("150px") },
      {
        title: "65",
        skeleton: skeleton("80px"),
        filter: {
          stateKey: "status",
          options: [
            { key: "success", title: "741", variant: "success" },
            { key: "pending", title: "743", variant: "pending" },
            { key: "failed", title: "742", variant: "failed" },
          ],
        },
      },
      {
        title: "746",
        width: "140px",
        skeleton: skeleton("80px"),
        filter: {
          stateKey: "title",
          options: [
            { key: "property_buy", title: "739" },
            { key: "property_dealing", title: "740" },
          ],
        },
      },
      {
        title: "750",
        width: "165px",
        skeleton: skeleton("80px"),
        filter: {
          stateKey: "subject",
          options: [
            { key: "blue", title: "753", icon: gif("blue") },
            { key: "red", title: "754", icon: gif("red") },
            { key: "yellow", title: "755", icon: gif("yellow") },
            { key: "rial", title: "756", icon: gif("irr") },
            { key: "psc", title: "757", icon: gif("psc") },
          ],
        },
      },
      { title: "66", skeleton: skeleton() },
      { title: "67", skeleton: skeleton("40px", "40px", "8px") },
    ],
  },
  //برای بخش درخواست های ارسالی دریافتی سلسله
  requests: {
    RowComponent: RequestRow,
    minHeight: "400px",
    // type ردیف همان variant است (sent یا received)
    getRowProps: (row, index, variant) => ({ type: variant }),
    // سربرگ ستون اول بر اساس variant عوض می‌شود
    columns: (variant) => [
      {
        title: variant === "sent" ? "1448" : "1447",
        skeleton: skeleton("100px"),
      },
      { title: "850", skeleton: skeleton("120px") },
      {
        title: "145",
        skeleton: skeleton("80px"),
        filter: {
          stateKey: "member",
          options: [
            { key: "child", title: "129" },
            { key: "wife", title: "825" },
            { key: "sister", title: "127" },
            { key: "brother", title: "128" },
            { key: "father", title: "125" },
            { key: "mother", title: "126" },
          ],
        },
      },
      {
        title: "146",
        skeleton: skeleton("80px"),
        filter: {
          stateKey: "status",
          options: [
            { key: "confirmed", title: "854" },
            { key: "pending", title: "852" },
            { key: "failed", title: "853" },
          ],
        },
      },
      { title: "851", skeleton: skeleton("100px") },
      { title: "147", skeleton: skeleton("40px", "40px", "8px") },
    ],
  },
  reports: {
    RowComponent: ReportRow,
    minHeight: "300px",
    columns: [
      { title: "1383", nowrap: true, width: "0%", skeleton: skeleton("40px") },
      { title: "19", width: "40%", skeleton: skeleton("200px") },
      {
        title: "746",
        nowrap: true,
        width: "12%",
        align: "center",

        skeleton: skeleton("100px"),
        filter: {
          stateKey: "member",
          options: [
            { key: "displayError", title: "1385" },
            { key: "spellingError", title: "15" },
            { key: "codingError", title: "16" },
            { key: "FPSError", title: "17" },
            { key: "disrespect", title: "18" },
          ],
        },
      },
      { title: "64", nowrap: true, width: "16%", skeleton: skeleton("120px") },
      {
        title: "1380",
        nowrap: true,
        width: "10%",
        skeleton: skeleton("40px", "40px", "6px"),
      },
    ],
  },
  // بخش جدید:
  // receipt: {
  //   RowComponent: ReceiptRow,
  //   detect: (row) => row && "receipt_id" in row,
  //   statusValues: {...},
  //   searchKey: "...",
  //   columns: [...],
  // },
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
      row?.[cfg.searchKey]?.toString().includes(searched) || false;
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
  loadMore,
  hasMore,
  isLoadMoreLoading,
  ...rowExtraProps // domain, subdomain و ... به ردیف پاس داده میشن
}) => {
  const config = resolveConfig(type, rows);
  const serverSide = Boolean(config?.serverSide);

  const [visibleCount, setVisibleCount] = useState(LOAD_STEP);
  const [openFilter, setOpenFilter] = useState(null);
  const sentinelRef = useRef(null);
  const filterRef = useRef(null);

  const canLoadMore =
    Boolean(hasMore) || (!serverSide && visibleCount < (rows?.length ?? 0));

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
  const visibleRows = serverSide ? rows : rows?.slice(0, visibleCount);

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
      <FilterMenu>
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

  const renderSkeleton = () =>
    Array.from({ length: 5 }, (_, index) => (
      <SkeletonRow key={index}>
        {columns.map(({ title, skeleton: cell }) => (
          <td key={title}>
            <SkeletonCell {...cell} />
          </td>
        ))}
      </SkeletonRow>
    ));

  return (
    <Container $minHeight={config.minHeight}>
      <Table>
        {renderHeader()}
        <tbody>
          {isLoading
            ? renderSkeleton()
            : visibleRows?.map((row, index) => (
                <RowComponent
                  key={row.id ?? index}
                  {...row}
                  {...rowExtraProps}
                  {...getRowProps?.(row, index, variant)}
                  isLoading={false}
                />
              ))}
        </tbody>
      </Table>

      {!isLoading && canLoadMore && (
        <>
          {isMobile ? (
            <Loader>
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
