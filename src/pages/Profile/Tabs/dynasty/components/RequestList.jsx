import styled from "styled-components";
import { useState, useEffect } from "react";
import Title from "../../../../../components/Title";
import SearchInput from "../../../../../components/SearchInput";
import useRequest from "../../../../../services/Hooks/useRequest";
import { getTranslation } from "../../../../../services/Utility";
import CustomDatePicker from "../../../../../components/CustomDatePicker";
import useDateFilter from "../../../../../services/Hooks/useDateFilter";
import Container from "../../../../../components/Common/Container";

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

const RequestList = ({
  title,
  requestType,
  ListComponent,
  userField = "to_user",
}) => {
  const { Request } = useRequest();
  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true); // اضافه شد
  const { dateRange, setDateRange, filterByDate } = useDateFilter();
  const [status, setStatus] = useState({
    pending: false,
    confirmed: false,
    failed: false,
  });

  const [member, setMember] = useState({
    father: false,
    mother: false,
    child: false,
    sister: false,
    brother: false,
    wife: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // اضافه شد
      try {
        const response = await Request(`dynasty/requests/${requestType}`);
        const formattedData = response.data.data.map((item) => ({
          id: item.id,
          code: item[userField]?.code,
          date: item.date,
          time: item.time,
          member: item.relationship,
          status:
            item.status === 1
              ? "confirmed"
              : item.status === 0
                ? "pending"
                : "failed",
          member_slug: item.relationship,
          gif: item?.prize?.satisfaction || 0,
          psc: item?.prize?.psc || 0,
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // اضافه شد
      }
    };

    fetchData();
  }, [requestType, userField]);

  const filteredItems = rows.filter((row) => {
    const codeMatch = row.code?.toString().includes(searched);
    const statusMatch =
      (!status.confirmed && !status.failed && !status.pending) ||
      (status.confirmed && row.status === "confirmed") ||
      (status.failed && row.status === "failed") ||
      (status.pending && row.status === "pending");
    const memberMatch =
      (!member.child &&
        !member.wife &&
        !member.brother &&
        !member.sister &&
        !member.father &&
        !member.mother) ||
      (member.child && row.member_slug === "فرزند") ||
      (member.wife && row.member_slug === "همسر") ||
      (member.brother && row.member_slug === "برادر") ||
      (member.sister && row.member_slug === "خواهر") ||
      (member.father && row.member_slug === "پدر") ||
      (member.mother && row.member_slug === "مادر");

    const dateMatch = filterByDate(row);

    return codeMatch && statusMatch && memberMatch && dateMatch;
  });
  return (
    <Container>
      <Div>
        <Title title={getTranslation(title)} />
      </Div>
      <Div>
        <SearchInput
          onchange={(e) => setSearched(e.target.value)}
          value={searched}
          placeholder={getTranslation(849)}
        />
        <CustomDatePicker
          value={dateRange}
          onChange={setDateRange}
          range={true}
        />
      </Div>
      <ListComponent
        setStatus={setStatus}
        setMember={setMember}
        member={member}
        status={status}
        rows={filteredItems}
        setRows={setRows}
        type={requestType}
        isLoading={loading} // این خط کلید حل مشکله
      />
    </Container>
  );
};

export default RequestList;
