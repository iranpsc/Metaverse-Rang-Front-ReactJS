import { MdKeyboardArrowDown } from "react-icons/md";
import styled from "styled-components";
import React, { useState } from "react";
import RequestRow from "../../pages/Profile/Tabs/dynasty/sent/RequestRow";
import { getTranslation } from "../../services/Utility";

const Container = styled.div`
  border-radius: 0.25rem;
  width: 100%;
  overflow-x: auto;
  min-height: 400px;
  &::-webkit-scrollbar {
    display: none;
  }
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 5px;
  border-collapse: collapse;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  @media (min-width: 1920px) {
    width: 100% !important;
  }
`;

const TableHead = styled.thead`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
`;

const TableRow = styled.tr``;
const StatusFilter = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 5px;
  top: 65px;
  width: 169px;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  font-size: 16px;
`;

const StatusFilterItems = styled.div`
  position: relative;
  border-radius: 5px;
  background-color: ${(props) =>
    props.$active ? props.theme.colors.shades[80] : "transparent"};
  &:hover {
    background-color: ${({ theme }) => theme.colors.shades[80]};
    transition: all 0.2s linear;
  }
  span {
    position: absolute;
    left: 10px;
    top: 3px;
    color: red;
    cursor: pointer;
    font-size: 14px;
  }
  h1 {
    font-weight: 400;
    color: ${(props) =>
    props.$active
      ? props.theme.colors.newColors.primaryText
      : props.theme.colors.newColors.shades.title};
    font-size: 16px;
    border-radius: 5px;
    padding: 2px 18px;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.newColors.primaryText};
    }
  }
`;
const TitleFilter = styled.div`
  position: absolute;
  top: 65px;
  gap: 5px;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  width: 140px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
`;

const FilterItem = styled.div`
  border-radius: 10px;
  display: flex;
  padding: 0 5px;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.$active ? props.theme.colors.shades[80] : "transparent"};
  color: ${(props) =>
    props.$active
      ? props.theme.colors.newColors.primaryText
      : props.theme.colors.newColors.shades.title};
  &:hover {
    background-color: ${({ theme }) => theme.colors.shades[80]};
    color: ${({ theme }) => theme.colors.newColors.primaryText};

    transition: all 0.2s linear;
  }
  span {
    color: red;
    font-size: 14px;
  }

  h1 {
    font-size: 16px;
    font-weight: 400;
  }
`;
const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;
const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const TableHeader = styled.th`
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  position: relative;
`;

const Loader = styled.div`
  margin: 10px 0;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    background-color: transparent;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    border: none;
  }
`;

const RequestsList = ({
  rows,
  member,
  status,
  setStatus,
  setMember,
  setShowDetails,
  type,
  isLoading, // اضافه شد
}) => {
  const [visibleRows, setVisibleRows] = useState(10);
  const [filters, setFilters] = useState({
    status: false,
    member: false,
  });

  const handleLoadMore = () => {
    setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
  };

  const handleMemberFilter = (memberType) => {
    setMember({ ...member, [memberType]: true });
    setFilters({ ...filters, member: false });
  };

  const handleMemberRemove = (memberType) => {
    setMember({ ...member, [memberType]: false });
    setFilters({ ...filters, member: false });
  };

  const handleStatusFilter = (statusType) => {
    setStatus({ ...status, [statusType]: true });
    setFilters({ ...filters, status: false });
  };

  const handleStatusRemove = (statusType) => {
    setStatus({ ...status, [statusType]: false });
    setFilters({ ...filters, status: false });
  };

  const memberTypes = [
    { key: "child", label: 129, type: "h1" },
    { key: "wife", label: 825, type: "h1" },
    { key: "sister", label: 127, type: "h1" },
    { key: "brother", label: 128, type: "h1" },
    { key: "father", label: 125, type: "h1" },
    { key: "mother", label: 126, type: "h1" },
  ];

  const statusTypes = [
    { key: "confirmed", label: 854 },
    { key: "pending", label: 852 },
    { key: "failed", label: 853 },
  ];
  return (
    <Container>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              {type === "sent" ? getTranslation(1448) : getTranslation(1447)}
            </TableHeader>
            <TableHeader date> {getTranslation(850)}</TableHeader>
            <TableHeader>
              <Div>
                {getTranslation(145)}
                <Arrows onClick={() => setFilters({ member: !filters.member })}>
                  <MdKeyboardArrowDown
                    style={{
                      transform: `${filters.member ? "rotate(180deg)" : "rotate(360deg)"
                        }`,
                    }}
                  />
                </Arrows>
              </Div>
              {filters.member && (
                <StatusFilter>
                  {memberTypes.map(({ key, label, type }) => (
                    <StatusFilterItems $active={member[key]} key={key}>
                      {React.createElement(
                        type,
                        {
                          onClick: () => handleMemberFilter(key),
                        },
                        getTranslation(label),
                      )}
                      {member[key] && (
                        <span onClick={() => handleMemberRemove(key)}>X</span>
                      )}
                    </StatusFilterItems>
                  ))}
                </StatusFilter>
              )}
            </TableHeader>
            <TableHeader $title>
              <Div>
                {getTranslation(146)}

                <Arrows onClick={() => setFilters({ status: !filters.status })}>
                  <MdKeyboardArrowDown
                    style={{
                      transform: `${filters.status ? "rotate(180deg)" : "rotate(360deg)"
                        }`,
                    }}
                  />
                </Arrows>
              </Div>
              {filters.status && (
                <TitleFilter>
                  {statusTypes.map(({ key, label }) => (
                    <FilterItem $active={status[key]} key={key}>
                      <h1 onClick={() => handleStatusFilter(key)}>
                        {getTranslation(label)}
                      </h1>
                      {status[key] && (
                        <span onClick={() => handleStatusRemove(key)}>X</span>
                      )}
                    </FilterItem>
                  ))}
                </TitleFilter>
              )}
            </TableHeader>
            <TableHeader subject>
              <Div>{getTranslation(851)}</Div>
            </TableHeader>
            <TableHeader>{getTranslation(147)}</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {isLoading
            ? // اسکلتون برای 5 ردیف
            Array.from({ length: 5 }).map((_, index) => (
              <RequestRow key={index} isLoading={true} />
            ))
            : rows
              .slice(0, visibleRows)
              .map((request) => (
                <RequestRow
                  key={request.id}
                  {...request}
                  type={type}
                  setShowDetails={setShowDetails}
                  isLoading={false}
                />
              ))}
        </tbody>
      </Table>
      {!isLoading && visibleRows < rows.length && (
        <Loader>
          <button onClick={handleLoadMore}>{getTranslation(1410)}</button>
        </Loader>
      )}
    </Container>
  );
};

export default RequestsList;
