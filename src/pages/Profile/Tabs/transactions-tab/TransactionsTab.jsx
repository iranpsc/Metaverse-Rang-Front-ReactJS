import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/yellow.css";

import DatePicker from "react-multi-date-picker";
import { FaRegCalendarAlt } from "react-icons/fa";

import TimePicker from "react-multi-date-picker/plugins/time_picker";

import TransactionsList from "./TransactionsList";
import blue from "../../../../assets/gif/blue-color.gif";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import psc from "../../../../assets/gif/psc.gif";
import red from "../../../../assets/gif/red-color.gif";
import rial from "../../../../assets/gif/rial.gif";
import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import yellow from "../../../../assets/gif/yellow-color.gif";
import SearchInput from "../../../../components/SearchInput";
import Title from "../../../../components/Title";
import useRequest from "../../../../services/Hooks/useRequest";
import { Skeleton } from "../../../../components/Skeleton";
import {
  getTranslation,
  ToastError,
} from "../../../../services/Utility";
import Container from "../../../../components/Common/Container";

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

const Date = styled.div`
  border-radius: 5px;
  border: 1px solid #454545;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  height: 48px;
  padding: 0 10px;
  svg {
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
  input {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    width: 200%;
    height: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    &:focus {
      border: none;
      outline: none;
    }
    font-size: 14px;
  }
`;

const SkeletonRow = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { Request } = useRequest();
  const loaderRef = useRef(null);
  const convertPersianToEnglish = (str) => {
    if (!str) return str;
    const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return str.replace(/[۰-۹]/g, (d) => persianNumbers.indexOf(d));
  };

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
  const [filterPage, setFilterPage] = useState(1);

  const fetchTransactions = async () => {
    setIsLoading(true);

    try {
      const statusParams = [];
      if (status.success) statusParams.push(0);
      if (status.failed) statusParams.push(-138);
      if (status.pending) statusParams.push(1);

      const titleParams = [];
      if (title.property_dealing) titleParams.push("trade");
      if (title.property_buy) titleParams.push("order");

      const subjectParams = [];
      if (subject.blue) subjectParams.push("blue");
      if (subject.red) subjectParams.push("red");
      if (subject.yellow) subjectParams.push("yellow");
      if (subject.psc) subjectParams.push("psc");
      if (subject.rial) subjectParams.push("irr");

      const isFilterActive =
        searched ||
        statusParams.length ||
        titleParams.length ||
        subjectParams.length ||
        dateRange[0];

      const currentPage = isFilterActive ? filterPage : page;

      const params = new URLSearchParams({
        page: currentPage,
        search: searched,
        type: titleParams.join(","),
        asset: subjectParams.join(","),
      });

      if (dateRange[0] && dateRange[1]) {
        params.append("start_date_time", convertPersianToEnglish(dateRange[0]));
        params.append("end_date_time", convertPersianToEnglish(dateRange[1]));
      }

      statusParams.forEach((status, index) => {
        params.append(`status[${index}]`, status);
      });

      const response = await Request(`user/transactions?${params.toString()}`);
      const newTransactions = response.data.data;
      const processedTransactions = newTransactions.map((transaction) => {
        let assetGif = null;
        switch (transaction.asset) {
          case "yellow":
            assetGif = yellow;
            break;
          case "red":
            assetGif = red;
            break;
          case "blue":
            assetGif = blue;
            break;
          case "psc":
            assetGif = psc;
            break;
          case "irr":
            assetGif = rial;
            break;
          default:
            assetGif = null;
        }
        return { ...transaction, assetGif };
      });

      if (isFilterActive) {
        if (currentPage === 1) {
          setFilteredTransactions(processedTransactions);
        } else {
          setFilteredTransactions((prev) => [
            ...prev,
            ...processedTransactions,
          ]);
        }
      } else {
        setFilteredTransactions([]);
        setTransactions((prev) =>
          currentPage === 1
            ? processedTransactions
            : [...prev, ...processedTransactions],
        );
      }

      setHasMore(response.data.links.next !== null);
    } catch (err) {
      ToastError(err.response?.data?.message || "خطا در دریافت تراکنش‌ها");
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const isFilterActive =
      searched ||
      Object.values(status).some(Boolean) ||
      Object.values(title).some(Boolean) ||
      Object.values(subject).some(Boolean) ||
      dateRange[0];

    if (isFilterActive) {
      setFilterPage(1);
      setFilteredTransactions([]);
    } else {
      setPage(1);
      setTransactions([]);
    }

    fetchTransactions();
  }, [searched, status, title, subject, dateRange]);

  useEffect(() => {
    if (filterPage > 1) {
      fetchTransactions();
    }
  }, [filterPage]);

  useEffect(() => {
    if (page > 1) {
      fetchTransactions();
    }
  }, [page]);

  // IntersectionObserver setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          const isFilterActive =
            searched ||
            Object.values(status).some(Boolean) ||
            Object.values(title).some(Boolean) ||
            Object.values(subject).some(Boolean) ||
            dateRange[0];

          if (isFilterActive) {
            setFilterPage((prev) => prev + 1);
          } else {
            setPage((prev) => prev + 1);
          }
        }
      },
      { threshold: 0.5 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading, searched, status, title, subject, dateRange]);

  const handleSearch = useCallback((e) => {
    const searchValue = e.target.value;
    setSearched(searchValue);
  }, []);

  const displayTransactions = filteredTransactions.length
    ? filteredTransactions
    : transactions;

  // لودینگ اولیه
  if (initialLoading) {
    return (
      <Container>
        <div>
          <Title title={getTranslation("61")} />
        </div>
        <Div>
          <SearchInput
            onchange={handleSearch}
            value={searched}
            placeholder={getTranslation("63")}
          />
          <Date>
            <DatePicker
              placeholder={getTranslation("763")}
              format="YYYY/MM/DD HH:mm:ss"
              plugins={[<TimePicker position="bottom" />]}
              calendar={persian}
              locale={persian_fa}
              calendarPosition="bottom-right"
              range
              value={dateRange}
              onChange={(dates) => {
                if (dates) {
                  const [start, end] = dates.toString().split(",");
                  setDateRange([start, end || null]);
                } else {
                  setDateRange([null, null]);
                }
              }}
            />
            <FaRegCalendarAlt size={20} />
          </Date>
        </Div>
        <div style={{ marginTop: "20px" }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonRow key={index}>
              <Skeleton width="40px" height="40px" radius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton
                  width="80%"
                  height="16px"
                  radius="4px"
                  style={{ marginBottom: "8px" }}
                />
                <Skeleton width="60%" height="12px" radius="4px" />
              </div>
              <Skeleton width="40px" height="40px" radius="10px" />
            </SkeletonRow>
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div>
        <Title title={getTranslation("61")} />
      </div>
      <Div>
        <SearchInput
          onchange={handleSearch}
          value={searched}
          placeholder={getTranslation("63")}
        />
        <Date>
          <DatePicker
            placeholder={getTranslation("763")}
            format="YYYY/MM/DD HH:mm:ss"
            plugins={[<TimePicker position="bottom" />]}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            range
            value={dateRange}
            onChange={(dates) => {
              if (dates) {
                const [start, end] = dates.toString().split(",");
                setDateRange([start, end || null]);
              } else {
                setDateRange([null, null]);
              }
            }}
          />
          <FaRegCalendarAlt size={20} />
        </Date>
      </Div>

      <TransactionsList
        setStatus={setStatus}
        setTitle={setTitle}
        setSubject={setSubject}
        title={title}
        status={status}
        subject={subject}
        rows={displayTransactions}
      />

      {/* اسکلتون لودینگ بیشتر (اینفینیتی اسکرول) */}
      {isLoading && displayTransactions.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          {Array.from({ length: 2 }).map((_, index) => (
            <SkeletonRow key={`loading-${index}`}>
              <Skeleton width="40px" height="40px" radius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton
                  width="80%"
                  height="16px"
                  radius="4px"
                  style={{ marginBottom: "8px" }}
                />
                <Skeleton width="60%" height="12px" radius="4px" />
              </div>
              <Skeleton width="40px" height="40px" radius="999px" />
            </SkeletonRow>
          ))}
        </div>
      )}

      {hasMore && <div ref={loaderRef} style={{ height: "20px" }} />}
    </Container>
  );
};

export default TransactionsTab;
