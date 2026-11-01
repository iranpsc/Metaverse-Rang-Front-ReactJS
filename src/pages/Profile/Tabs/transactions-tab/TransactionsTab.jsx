// تب تراکنش‌های کاربر با سرچ، فیلتر وضعیت/نوع/دارایی (داخل GenericList)، بازه‌ی تاریخ شمسی و اسکرول بی‌نهایت؛ مناسب صفحه‌ی کیف پول برای نمایش و فیلتر تاریخچه‌ی تراکنش‌ها

import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/yellow.css";
import styled from "styled-components";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import GenericList from "../../../../components/GenericList/GenericList";
import SearchInput from "../../../../components/SearchInput";
import TitleHeader from "../../../../components/TitleHeader";
import Container from "../../../../components/Common/Container";
import useRequest from "../../../../hooks/useRequest.js";
import { COLOR_CONFIG } from "../../../../services/constants/colorConfig";
import {
  convertToEnglish,
  getTranslation,
  ToastError,
} from "../../../../services/Utility";

// کلیدهای استیت فیلترها => مقداری که به بک‌اند ارسال می‌شود
const STATUS_VALUES = { success: 0, failed: -138, pending: 1 };
const TITLE_VALUES = { property_dealing: "trade", property_buy: "order" };
const SUBJECT_VALUES = {
  blue: "blue",
  red: "red",
  yellow: "yellow",
  psc: "psc",
  rial: "irr",
};

const DATE_PLUGINS = [<TimePicker key="time" position="bottom" />];

// مقدارهای بک‌اندِ کلیدهای فعال یک فیلتر
const pickActive = (state, valuesMap) =>
  Object.keys(valuesMap)
    .filter((key) => state[key])
    .map((key) => valuesMap[key]);

const Div = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  align-items: center;
  gap: 20px;
  margin-top: 15px;

  @media (min-width: 1024px) {
    grid-template-columns: 3fr 1fr;
  }
`;

const DateBox = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 10px;
  overflow: hidden;
  border: 1px solid #454545;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  svg {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  input {
    width: 200%;
    height: 100%;
    border: none;
    outline: none;
    background-color: transparent;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const TransactionsTab = () => {
  const { Request } = useRequest();
  const pageRef = useRef(1);
  const requestIdRef = useRef(0);

  const [searched, setSearched] = useState("");
  const [status, setStatus] = useState({
    success: false,
    failed: false,
    pending: false,
  });
  const [title, setTitle] = useState({
    property_dealing: false,
    property_buy: false,
  });
  const [subject, setSubject] = useState({
    blue: false,
    red: false,
    yellow: false,
    psc: false,
    rial: false,
  });
  const [dateRange, setDateRange] = useState([null, null]);

  const [transactions, setTransactions] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // صفحه‌ی ۱ (اولیه یا تغییر فیلتر)
  const [loadingMore, setLoadingMore] = useState(false);

  // فیلترها و فیلتر کردن سمت سرور؛ با تغییر هر فیلتر، لیست از اول لود می‌شود
  const filters = useMemo(
    () => ({ status, title, subject }),
    [status, title, subject],
  );
  const setFilters = useMemo(
    () => ({ status: setStatus, title: setTitle, subject: setSubject }),
    [],
  );

  // کوئری فیلترها (بدون page)
  const query = useMemo(() => {
    const params = new URLSearchParams({
      search: searched,
      type: pickActive(title, TITLE_VALUES).join(","),
      asset: pickActive(subject, SUBJECT_VALUES).join(","),
    });

    const [start, end] = dateRange;
    if (start && end) {
      params.append("start_date_time", convertToEnglish(start));
      params.append("end_date_time", convertToEnglish(end));
    }

    pickActive(status, STATUS_VALUES).forEach((value, index) =>
      params.append(`status[${index}]`, value),
    );

    return params.toString();
  }, [searched, status, title, subject, dateRange]);

  const fetchPage = useCallback(
    async (pageNum) => {
      // فقط پاسخ آخرین درخواست اعمال می‌شود (جلوگیری از بازنویسی با پاسخ قدیمی)
      const requestId = ++requestIdRef.current;
      pageNum === 1 ? setLoading(true) : setLoadingMore(true);

      try {
        const { data } = await Request(
          `user/transactions?page=${pageNum}&${query}`,
        );
        if (requestId !== requestIdRef.current) return;

        const rows = (data.data ?? []).map((transaction) => ({
          ...transaction,
          assetGif: COLOR_CONFIG[transaction.asset]?.gif ?? null,
        }));

        setTransactions((prev) => (pageNum === 1 ? rows : [...prev, ...rows]));
        setHasMore(!!data.links?.next);
        pageRef.current = pageNum;
      } catch (err) {
        if (requestId === requestIdRef.current) {
          ToastError(err.response?.data?.message || "خطا در دریافت تراکنش‌ها");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [query],
  );

  const loadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore) fetchPage(pageRef.current + 1);
  }, [loading, loadingMore, hasMore, fetchPage]);

  useEffect(() => {
    setHasMore(true);
    fetchPage(1);
  }, [fetchPage]);

  const handleSearch = useCallback((e) => setSearched(e.target.value), []);

  const handleDateChange = useCallback((dates) => {
    if (!dates) return setDateRange([null, null]);

    const [start, end] = dates.toString().split(",");
    setDateRange([start, end || null]);
  }, []);

  return (
    <Container>
      <div>
        <TitleHeader title={getTranslation("61")} />
      </div>

      <Div>
        <SearchInput
          onchange={handleSearch}
          value={searched}
          placeholder={getTranslation("63")}
        />
        <DateBox>
          <DatePicker
            range
            placeholder={getTranslation("763")}
            format="YYYY/MM/DD HH:mm:ss"
            plugins={DATE_PLUGINS}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            value={dateRange}
            onChange={handleDateChange}
          />
          <FaRegCalendarAlt size={20} />
        </DateBox>
      </Div>

      <GenericList
        type="transactions"
        rows={transactions}
        isLoading={loading}
        loadMore={loadMore}
        hasMore={hasMore}
        isLoadMoreLoading={loadingMore}
        filters={filters}
        setFilters={setFilters}
      />
    </Container>
  );
};

export default TransactionsTab;