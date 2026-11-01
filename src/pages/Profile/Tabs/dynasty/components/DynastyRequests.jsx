// صفحه‌ی لیست درخواست‌های ارسالی یا دریافتی سلسله (با requestType) با سرچ روی کد، بازه‌ی تاریخ و فیلتر عضو و وضعیت (داخل GenericList)؛ مناسب تب‌های sent و recieved

import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import TitleHeader from "../../../../../components/TitleHeader.jsx";
import SearchInput from "../../../../../components/SearchInput.jsx";
import CustomDatePicker from "../../../../../components/CustomDatePicker.jsx";
import Container from "../../../../../components/Common/Container.jsx";
import GenericList from "../../../../../components/GenericList/GenericList.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import useDateFilter from "../../../../../hooks/useDateFilter.js";
import { getTranslation } from "../../../../../services/Utility/index.jsx";

// کد status بک‌اند => کلید وضعیت (هر مقدار دیگر ناموفق است)
const STATUS_BY_CODE = { 1: "confirmed", 0: "pending" };

// کلید فیلتر عضو => مقدار relationship که بک‌اند می‌فرستد
const MEMBER_LABELS = {
  child: "فرزند",
  wife: "همسر",
  brother: "برادر",
  sister: "خواهر",
  father: "پدر",
  mother: "مادر",
};

const INITIAL_STATUS = { pending: false, confirmed: false, failed: false };
const INITIAL_MEMBER = {
  father: false,
  mother: false,
  child: false,
  sister: false,
  brother: false,
  wife: false,
};

// کلیدهای فعال یک فیلتر
const activeKeys = (state) => Object.keys(state).filter((key) => state[key]);

const Header = styled.div`
  margin-top: 15px;
`;

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

const DynastyRequests = ({ title, requestType, userField = "to_user" }) => {
  const { Request } = useRequest();
  const { dateRange, setDateRange, filterByDate } = useDateFilter();

  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [member, setMember] = useState(INITIAL_MEMBER);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await Request(`dynasty/requests/${requestType}`);
        if (cancelled) return;

        setRows(
          response.data.data.map((item) => ({
            id: item.id,
            code: item[userField]?.code,
            date: item.date,
            time: item.time,
            member: item.relationship,
            member_slug: item.relationship,
            status: STATUS_BY_CODE[item.status] ?? "failed",
            gif: item?.prize?.satisfaction || 0,
            psc: item?.prize?.psc || 0,
          })),
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [requestType, userField]);

  const filteredItems = useMemo(() => {
    const statuses = activeKeys(status);
    const members = activeKeys(member).map((key) => MEMBER_LABELS[key]);

    return rows.filter(
      (row) =>
        (!searched || row.code?.toString().includes(searched)) &&
        (!statuses.length || statuses.includes(row.status)) &&
        (!members.length || members.includes(row.member_slug)) &&
        filterByDate(row),
    );
  }, [rows, searched, status, member, filterByDate, dateRange]);

  return (
    <Container>
      <Header>
        <TitleHeader title={getTranslation(title)} />
      </Header>

      <Toolbar>
        <SearchInput
          placeholder={getTranslation(849)}
          value={searched}
          onchange={(e) => setSearched(e.target.value)}
        />
        <CustomDatePicker value={dateRange} onChange={setDateRange} range />
      </Toolbar>

      <GenericList
        type="requests"
        variant={requestType}
        rows={filteredItems}
        setRows={setRows}
        isLoading={loading}
        filters={{ status, member }}
        setFilters={{ status: setStatus, member: setMember }}
      />
    </Container>
  );
};

export default DynastyRequests;
