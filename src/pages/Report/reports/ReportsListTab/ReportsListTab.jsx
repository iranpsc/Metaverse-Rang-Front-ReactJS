// تب لیست گزارش‌های کاربر (سرچ روی عنوان، بازه‌ی تاریخ و فیلتر نوع گزارش) با بارگذاری صفحه‌به‌صفحه؛ مناسب صفحه‌ی گزارش‌ها که لیست را از سرور می‌گیرد و فیلترها را روی ردیف‌های لودشده اعمال می‌کند

import styled from "styled-components";
import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../../../../components/Common/Container";
import CustomDatePicker from "../../../../components/CustomDatePicker";
import GenericList from "../../../../components/GenericList/GenericList.jsx";
import SearchInput from "../../../../components/SearchInput";
import TitleHeader from "../../../../components/TitleHeader";
import useDateFilter from "../../../../hooks/useDateFilter.js";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";

// کلیدهای فیلتر همان مقدار subject ردیف‌ها هستند
const INITIAL_MEMBER = {
  disrespect: false,
  codingError: false,
  displayError: false,
  FPSError: false,
  spellingError: false,
};

const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  align-items: center;
  gap: 20px;
  margin-top: 15px;

  @media (min-width: 1024px) {
    grid-template-columns: 3fr 1fr;
  }
`;

const ReportsListTab = () => {
  const { Request } = useRequest();
  const { dateRange, setDateRange, filterByDate } = useDateFilter();
  const pageRef = useRef(1);

  const [searched, setSearched] = useState("");
  const [member, setMember] = useState(INITIAL_MEMBER);
  const [rows, setRows] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true); // صفحه‌ی ۱
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = async (page) => {
    page === 1 ? setLoading(true) : setLoadingMore(true);

    try {
      const { data } = await Request(`reports?page=${page}`);

      // ردیف‌ها همان‌طور که از بک‌اند می‌آیند ذخیره می‌شوند
      setRows((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
      setHasMore(!!data.links?.next);
      pageRef.current = page;
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(1);
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore) fetchPage(pageRef.current + 1);
  };

  const filteredRows = useMemo(() => {
    const subjects = Object.keys(member).filter((key) => member[key]);

    return rows.filter(
      (row) =>
        String(row.title).includes(searched) &&
        (!subjects.length || subjects.includes(row.subject)) &&
        filterByDate(row),
    );
  }, [rows, searched, member, filterByDate, dateRange]);

  return (
    <Container>
      <TitleHeader title={getTranslation("22")} />

      <Toolbar>
        <SearchInput
          placeholder={getTranslation("1381")}
          value={searched}
          onchange={(e) => setSearched(e.target.value)}
        />
        <CustomDatePicker value={dateRange} onChange={setDateRange} range />
      </Toolbar>

      <GenericList
        type="reports"
        rows={filteredRows}
        isLoading={loading}
        loadMore={handleLoadMore}
        hasMore={hasMore}
        isLoadMoreLoading={loadingMore}
        filters={{ member }}
        setFilters={{ member: setMember }}
      />
    </Container>
  );
};

export default ReportsListTab;