// تب تراکنش‌های کاربر با سرچ، فیلتر وضعیت/نوع/دارایی (داخل GenericList)، بازه‌ی تاریخ شمسی و اسکرول بی‌نهایت؛ مناسب صفحه‌ی کیف پول برای نمایش و فیلتر تاریخچه‌ی تراکنش‌ها

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { toJalaali } from "jalaali-js";
import GenericList from "../../../../components/GenericList/GenericList";
import TitleHeader from "../../../../components/TitleHeader";
import Container from "../../../../components/Common/Container";
import useRequest from "../../../../hooks/useRequest.js";
import { COLOR_CONFIG } from "../../../../services/constants/colorConfig";
import {
  getTranslation,
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

const formatDateForQuery = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const { jy, jm, jd } = toJalaali(date);
  const pad = (value) => String(value).padStart(2, "0");

  return `${jy}/${pad(jm)}/${pad(jd)} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};

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
      params.append("start_date_time", formatDateForQuery(start));
      params.append("end_date_time", formatDateForQuery(end));
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
      } catch {
        // useRequest already displays request errors.
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

  return (
    <Container>
      <div>
        <TitleHeader title={getTranslation("61")} />
      </div>

      <GenericList
        type="transactions"
        searchConfig={{
          value: searched,
          onChange: setSearched,
          placeholder: getTranslation("63"),
        }}
        dateFilterConfig={{
          value: dateRange,
          onChange: setDateRange,
          placeholder: getTranslation("763"),
          format: "YYYY/MM/DD HH:mm:ss",
          plugins: DATE_PLUGINS,
        }}
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