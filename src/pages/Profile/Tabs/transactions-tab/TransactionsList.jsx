import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import TransactionRow from "./TransactionRow";
import blue from "../../../../assets/gif/blue-color.gif";
import psc from "../../../../assets/gif/psc.gif";
import red from "../../../../assets/gif/red-color.gif";
import rial from "../../../../assets/gif/rial.gif";
import yellow from "../../../../assets/gif/yellow-color.gif";
import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility";

const Container = styled.div`
  border-radius: 0.25rem;
  min-height: 300px;
  overflow-x: auto;
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 5px;
  border-collapse: collapse;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`;

const TableHead = styled.thead`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px !important;
  overflow: hidden !important;
`;

const TableRow = styled.tr``;
const StatusFilter = styled.div`
  position: absolute;
  z-index: 10;
  top: 65px;
  width: 169px;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const TitleFilter = styled.div`
  position: absolute;
    z-index: 10;

  top: 65px;
  width: 130px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
`;
const SubjectFilter = styled.div`
  position: absolute;

  top: 65px;
  width: max-content;
  padding: 20px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  font-size: 12px;
  div {
    position: relative;
    padding: 4px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.shades[80]};
      color: ${({ theme }) => theme.colors.newColors.primaryText};
      transition: all 0.1s linear;
    }
  }
`;

const TableHeader = styled.th`
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  position: relative;
  width: ${(props) =>
    props.date ? "235px" : props.subject ? "165px" : props.title && "140px"};
`;

const subjects = [
  { id: 1, label: "blue", slug: "753", gif: blue },
  { id: 2, label: "red", slug: "754", gif: red },
  { id: 3, label: "yellow", slug: "755", gif: yellow },
  { id: 4, label: "rial", slug: "756", gif: rial },
  { id: 5, label: "psc", slug: "757", gif: psc },
];

const TableBody = styled.tbody``;

const TableHeaderText = styled.span``;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

const FilterArrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const RotatingArrow = styled(MdKeyboardArrowDown)`
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(360deg)")};
`;

const FilterItem = styled.div`
  position: relative;
  padding: ${(props) => props.padding || "0"};
  background-color: ${(props) => {
    if (props.active) {
      if (props.variant === "success") return "#18c09017";
      if (props.variant === "pending") return "#ffc80017";
      if (props.variant === "failed") return "#ff000017";
      return props.theme.colors.shades[80];
    }
    return "transparent";
  }};

  color: ${(props) => {
    if (props.active) {
      if (props.variant === "success") return "#18c08f";
      if (props.variant === "pending") return "#ffc800";
      if (props.variant === "failed") return "#ff0000";
      return props.theme.colors.newColors.primaryText;
    }
    return (props) => props.theme.colors.newColors.title;
  }};
  border-radius: ${(props) => props.borderRadius || "0"};
  &:hover {
    color: #dedee9 !important;
    transition: all 0.2s linear;

    background-color: ${(props) =>
    props.noHoverBg
      ? "transparent !important"
      : props.theme.colors.shades[80]};
  }
`;

const FilterItemText = styled.h1`
  font-size: 16px;
  &:hover {
    color: ${(props) => {
    if (props.variant === "success") return "#18c08f";
    if (props.variant === "pending") return "#ffc800";
    if (props.variant === "failed") return "#ff0000";
    return props.theme.colors.newColors.primaryText;
  }};
    background-color: ${(props) => {
    if (props.variant === "success") return "#18c09017";
    if (props.variant === "pending") return "#ffc80017";
    if (props.variant === "failed") return "#ff000017";
    return "transparent";
  }};
  }
  font-weight: 400;
  cursor: pointer;
  margin: ${(props) => props.margin || "0"};
  border-radius: 5px;
  padding: ${(props) => props.padding || "0"};
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const SubjectFilterItem = styled.div`
  display: flex;
  gap: 5px;
  cursor: pointer;
  align-items: center;
  color: ${(props) =>
    props.active
      ? props.theme.colors.newColors.primaryText
      : props.theme.colors.newColors.shades.title};
  background-color: ${(props) =>
    props.active ? props.theme.colors.shades[80] : "transparent"};
  margin-bottom: ${(props) => (props.isLast ? "0" : "10px")};
  border-radius: 10px;
  padding: 3px;
`;

const SubjectFilterImage = styled.img`
  width: 24px;
  height: 26px;
`;

const SubjectFilterText = styled.h3``;

const TransactionsList = ({
  rows,
  title,
  status,
  subject,
  setStatus,
  setTitle,
  setSubject,
}) => {
  const [filters, setFilters] = useState({
    status: false,
    title: false,
    subject: false,
  });
  const paymentReturned =
    sessionStorage.getItem("payment_returned") === "true";
  return (
    <Container>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              <TableHeaderText>{getTranslation("63")}</TableHeaderText>
            </TableHeader>
            <TableHeader date>
              <TableHeaderText>{getTranslation("64")}</TableHeaderText>
            </TableHeader>
            <TableHeader>
              <FilterContainer>
                <TableHeaderText>{getTranslation("65")}</TableHeaderText>
                <FilterArrows
                  onClick={() => setFilters({ status: !filters.status })}
                >
                  <RotatingArrow $isOpen={filters.status} />
                </FilterArrows>
              </FilterContainer>
              {filters.status && (
                <StatusFilter>
                  <FilterItem
                    active={status.success}
                    variant="success"
                    borderRadius="5px"
                    noHoverBg
                  >
                    <FilterItemText
                      variant="success"
                      padding="2px 18px"
                      onClick={() => {
                        setStatus((prev) => ({
                          ...prev,
                          success: !prev.success,
                        }));
                        setFilters({ ...filters, status: false });
                      }}
                    >
                      {getTranslation("741")}
                    </FilterItemText>
                  </FilterItem>

                  <FilterItem
                    active={status.pending}
                    variant="pending"
                    borderRadius="5px"
                    noHoverBg
                  >
                    <FilterItemText
                      variant="pending"
                      padding="2px 18px"
                      onClick={() => {
                        setStatus((prev) => ({
                          ...prev,
                          pending: !prev.pending,
                        }));
                        setFilters({ ...filters, status: false });
                      }}
                    >
                      {getTranslation("743")}
                    </FilterItemText>
                  </FilterItem>

                  <FilterItem
                    active={status.failed}
                    variant="failed"
                    borderRadius="5px"
                    noHoverBg
                  >
                    <FilterItemText
                      variant="failed"
                      padding="2px 18px"
                      onClick={() => {
                        setStatus((prev) => ({
                          ...prev,
                          failed: !prev.failed,
                        }));
                        setFilters({ ...filters, status: false });
                      }}
                    >
                      {getTranslation("742")}
                    </FilterItemText>
                  </FilterItem>
                </StatusFilter>
              )}
            </TableHeader>
            <TableHeader $title>
              <FilterContainer>
                <TableHeaderText>{getTranslation("746")}</TableHeaderText>
                <FilterArrows
                  onClick={() => setFilters({ title: !filters.title })}
                >
                  <RotatingArrow $isOpen={filters.title} />
                </FilterArrows>
              </FilterContainer>
              {filters.title && (
                <TitleFilter>
                  <FilterItem active={title.property_buy} borderRadius="10px">
                    <FilterItemText
                      onClick={() => {
                        setTitle((prev) => ({
                          ...prev,
                          property_buy: !prev.property_buy,
                        }));
                        setFilters({ ...filters, title: false });
                      }}
                    >
                      {getTranslation("739")}
                    </FilterItemText>
                  </FilterItem>
                  <FilterItem
                    active={title.property_dealing}
                    borderRadius="10px"
                  >
                    <FilterItemText
                      onClick={() => {
                        setTitle((prev) => ({
                          ...prev,
                          property_dealing: !prev.property_dealing,
                        }));
                        setFilters({ ...filters, title: false });
                      }}
                    >
                      {getTranslation("740")}
                    </FilterItemText>
                  </FilterItem>
                </TitleFilter>
              )}
            </TableHeader>
            <TableHeader subject>
              <FilterContainer>
                <TableHeaderText>{getTranslation("750")}</TableHeaderText>
                <FilterArrows
                  onClick={() => setFilters({ subject: !filters.subject })}
                >
                  <RotatingArrow $isOpen={filters.subject} />
                </FilterArrows>
              </FilterContainer>
              {filters.subject && (
                <SubjectFilter>
                  {subjects.map((item, index) => (
                    <SubjectFilterItem
                      key={item.id}
                      active={subject[item.label]}
                      isLast={index === subjects.length - 1}
                      onClick={() => {
                        setSubject((prev) => ({
                          ...prev,
                          [item.label]: !prev[item.label],
                        }));
                        setFilters({ ...filters, subject: false });
                      }}
                    >
                      <SubjectFilterImage
                        src={item.gif}
                        alt={item.label}
                        loading="lazy"
                      />
                      <SubjectFilterText>
                        {getTranslation(item.slug)}
                      </SubjectFilterText>
                    </SubjectFilterItem>
                  ))}
                </SubjectFilter>
              )}
            </TableHeader>
            <TableHeader>
              <TableHeaderText>{getTranslation("66")}</TableHeaderText>
            </TableHeader>
            <TableHeader>
              <TableHeaderText>{getTranslation("67")}</TableHeaderText>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((transaction, index) => (
            <TransactionRow
              key={index}
              {...transaction}
              paymentReturned={paymentReturned && index === 0}
            />
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default TransactionsList;
