// صفحه لیست تیکت‌های ارسالی؛ مناسب نمایش جدول تیکت‌ها با سرچ، فیلتر وضعیت و صفحه‌بندی
import { useEffect, useState } from "react";
import TitleHeader from "../../../../../components/TitleHeader.jsx";
import GenericList, {
  filterListRows,
} from "../../../../../components/GenericList/GenericList.jsx";
import Container from "../../../../../components/Common/Container.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import { getTranslation,normalizeRequestPath } from "../../../../../services/Utility/index.jsx";


const SentList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [status, setStatus] = useState({
    pending: false,
    confirmed: false,
    failed: false,
    read: false,
  });
  const { Request } = useRequest();
  const fetchTickets = async (endpoint, append = false) => {
    try {
      const response = await Request(endpoint);
      const data = response.data.data || [];
      setNextPageUrl(response.data.next_page_url || null);
      setRows((prevRows) => (append ? [...prevRows, ...data] : data));
      return data.length;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      if (!append) setRows([]);
      return 0;
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTickets("tickets").finally(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    if (!nextPageUrl) return 0;

    setLoadingMore(true);
    const loadedCount = await fetchTickets(
      normalizeRequestPath(nextPageUrl),
      true,
    );
    setLoadingMore(false);
    return loadedCount;
  };

  const filteredItems = filterListRows("tickets", rows, "", status);
  console.log("row",filteredItems)
  return (
    <Container>
      <TitleHeader title={getTranslation("1336")} />
      <GenericList
        type="tickets"
        variant="sent"
        searchConfig={{
          key: "title",
          placeholder: getTranslation("1337"),
        }}
        dateFilterConfig={{
          key: "date",
          placeholder: getTranslation("1338"),
        }}
        setStatus={setStatus}
        status={status}
        rows={filteredItems}
        isLoading={loading}
        loadMore={loadMore}
        hasMore={!!nextPageUrl}
        isLoadMoreLoading={loadingMore}
      />
    </Container>
  );
};

export default SentList;
