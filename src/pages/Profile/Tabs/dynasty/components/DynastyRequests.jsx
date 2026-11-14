// صفحه‌ی لیست درخواست‌های ارسالی یا دریافتی سلسله (با requestType) با سرچ روی کد، بازه‌ی تاریخ و فیلتر عضو و وضعیت (داخل GenericList)؛ مناسب تب‌های sent و recieved

import styled from "styled-components";
import { useContext, useEffect, useMemo, useState } from "react";
import TitleHeader from "../../../../../components/TitleHeader.jsx";
import Container from "../../../../../components/Common/Container.jsx";
import GenericList from "../../../../../components/GenericList/GenericList.jsx";
import LoadingSpinner from "../../../../../components/Loading/LoadingSpinner.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../../services/Utility/index.jsx";
import DynastyAccessGuard from "../DynastyAccessGuard.jsx";
import { UserContext } from "../../../../../services/reducers/UserContext.jsx";

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

const DynastyRequests = ({ title, requestType, userField = "to_user" }) => {
  const { Request } = useRequest();
  const [user] = useContext(UserContext);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessLoading, setAccessLoading] = useState(true);
  const [accessError, setAccessError] = useState(null);
  const [hasDynasty, setHasDynasty] = useState(false);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [member, setMember] = useState(INITIAL_MEMBER);

  useEffect(() => {
    let cancelled = false;
    setAccessLoading(true);
    setLoading(true);

    const fetchData = async () => {
      try {
        const dynastyResponse = await Request("dynasty");
        if (cancelled) return;

        const dynasty = dynastyResponse.data.data;
        const userHasDynasty = Boolean(dynasty["user-has-dynasty"]);
        setHasDynasty(userHasDynasty);

        if (!userHasDynasty || !user?.verified_kyc) {
          setRows([]);
          return;
        }

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
          if (!cancelled) console.error("Error fetching dynasty requests:", error);
        }
      } catch (error) {
        if (!cancelled) {
          setAccessError("Failed to fetch dynasty access");
          console.error("Error fetching dynasty access:", error);
        }
      } finally {
        if (!cancelled) {
          setAccessLoading(false);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [requestType, userField, user?.verified_kyc]);

  const filteredItems = useMemo(() => {
    const statuses = activeKeys(status);
    const members = activeKeys(member).map((key) => MEMBER_LABELS[key]);

    return rows.filter(
      (row) =>
        (!statuses.length || statuses.includes(row.status)) &&
        (!members.length || members.includes(row.member_slug)),
    );
  }, [rows, status, member]);

  if (accessLoading) {
    return <LoadingSpinner size="large" color="#4a90e2" fullScreen={false} />;
  }

  return (
    <Container>
      <DynastyAccessGuard
        hasDynasty={hasDynasty}
        loading={accessLoading}
        error={accessError}
      >
        <Header>
          <TitleHeader title={getTranslation(title)} />
        </Header>

        <GenericList
          type="requests"
          variant={requestType}
          searchConfig={{
            key: "code",
            placeholder: getTranslation(849),
          }}
          dateFilterConfig={{ key: "date" }}
          rows={filteredItems}
          setRows={setRows}
          isLoading={loading}
          filters={{ status, member }}
          setFilters={{ status: setStatus, member: setMember }}
        />
      </DynastyAccessGuard>
    </Container>
  );
};

export default DynastyRequests;
