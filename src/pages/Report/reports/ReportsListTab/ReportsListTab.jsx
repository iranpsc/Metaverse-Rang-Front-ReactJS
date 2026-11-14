// تب لیست گزارش‌های کاربر (سرچ روی عنوان، بازه‌ی تاریخ و فیلتر نوع گزارش) با بارگذاری صفحه‌به‌صفحه؛ مناسب صفحه‌ی گزارش‌ها که لیست را از سرور می‌گیرد و فیلترها را روی ردیف‌های لودشده اعمال می‌کند

import { useEffect, useMemo, useRef, useState } from "react";
import Container from "../../../../components/Common/Container";
import GenericList from "../../../../components/GenericList/GenericList.jsx";
import TitleHeader from "../../../../components/TitleHeader";
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

const ReportsListTab = () => {
  const { Request } = useRequest();
  const pageRef = useRef(1);

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
      (row) => !subjects.length || subjects.includes(row.subject),
    );
  }, [rows, member]);

  return (
    <Container>
      <TitleHeader title={getTranslation("22")} />

      <GenericList
        type="reports"
        searchConfig={{
          key: "title",
          placeholder: getTranslation("1381"),
        }}
        dateFilterConfig={{ key: "datetime" }}
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