import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/yellow.css";
import DatePicker from "react-multi-date-picker";
import { FaRegCalendarAlt } from "react-icons/fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Title from "../../../../components/Title";
import SearchInput from "../../../../components/SearchInput";
import VodList from "../../VodList";
import { getTranslation } from "../../../../services/Utility";
import useRequest from "../../../../hooks/useRequest.js";
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
    color: ${(props) => props.theme.colors.newColors.otherColors.iconBg};
  }
  input {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    &:focus {
      border: none;
      outline: none;
    }
    font-size: 16px;
  }
  ${({ disabled }) =>
    disabled &&
    `
    background-color: #e0e0e0;
    pointer-events: none;
    opacity: 0.6;
    svg {
      color: #a0a0a0;
    }
    input {
      color: #a0a0a0;
    }
  `}
`;

const ReceivedList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [searched, setSearched] = useState("");
  const [status, setStatus] = useState({
    pending: false,
    confirmed: false,
    failed: false,
    read: false,
  });

  const { Request } = useRequest();

  const normalizeRequestPath = (url) => {
    if (!url) return "";
    if (url.startsWith("/api/")) {
      return url.substring(5);
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const parsed = new URL(url);
        return parsed.pathname.replace(/^\/api\//, "") + parsed.search;
      } catch {
        return url;
      }
    }
    return url;
  };

  const fetchTickets = async (endpoint, append = false) => {
    try {
      const response = await Request(endpoint);
      const data = response.data.data || [];
      const nextUrl = response.data.next_page_url || null;
      setNextPageUrl(nextUrl);
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
    fetchTickets("tickets?recieved=1")
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loadMore = async () => {
    if (!nextPageUrl) {
      return 0;
    }

    setLoadingMore(true);
    const endpoint = normalizeRequestPath(nextPageUrl);
    const loadedCount = await fetchTickets(endpoint, true);
    setLoadingMore(false);
    return loadedCount;
  };
  const filteredItems = rows.filter((row) => {
    const codeMatch = row?.title?.toString().includes(searched) || false;
    const statusMatch =
      (!status.confirmed &&
        !status.failed &&
        !status.pending &&
        !status.read) ||
      (status.confirmed && row.status === 1) ||
      (status.failed && row.status === 5) ||
      (status.read && row.status === 4) ||
      (status.pending && row.status === 0);

    return codeMatch && statusMatch;
  });

  return (
    <Container>
      <Title title={getTranslation("1335")} />

      <Div>
        <SearchInput
          onchange={(e) => setSearched(e.target.value)}
          value={searched}
          placeholder={getTranslation("1337")}
        />
        <Date disabled>
          <DatePicker
            placeholder={getTranslation("1338")}
            className="bg-dark yellow"
            format="YYYY/DD/MM HH:mm:ss"
            plugins={[<TimePicker position="bottom" />]}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            disabled={true}
          />
          <FaRegCalendarAlt size={20} />
        </Date>
      </Div>
      <VodList
        setStatus={setStatus}
        status={status}
        rows={filteredItems}
        mode="send"
        isLoading={loading}
        loadMore={loadMore}
        hasMore={!!nextPageUrl}
        isLoadMoreLoading={loadingMore}
      />
    </Container>
  );
};

export default ReceivedList;