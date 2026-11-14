import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility";
import TitleValue from "../../../../components/TitleValue";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const First = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 1284px) {
    flex-direction: column;
  }
`;

const Third = styled.div`
  display: flex;
  gap: 20px;
`;

const hasValue = (item) =>
  item?.value !== undefined && item?.value !== null && item?.value !== "";

const renderRows = (rows, options = {}) =>
  rows
    .filter(hasValue)
    .map((row) => (
      <TitleValue
        key={row.id}
        long
        smallValue
        tag={options.tag === row.id}
        icon={row.icon}
        value={row.value}
        title={getTranslation(row.title)}
      />
    ));

const Inputs = ({ inputs }) => {
  const firstRow = inputs?.first_row_info ?? [];
  const secondRow = inputs?.second_row_info ?? [];
  const thirdRow = inputs?.third_row_info ?? [];

  return (
    <Container>
      {firstRow.some(hasValue) && (
        <First>{renderRows(firstRow, { tag: 1 })}</First>
      )}

      {secondRow.some(hasValue) && (
        <TitleValue
          long
          smallValue
          title={getTranslation(secondRow[0].title)}
          value={secondRow[0].value}
          icon={secondRow[0].icon}
        />
      )}

      {thirdRow.some(hasValue) && <Third>{renderRows(thirdRow)}</Third>}
    </Container>
  );
};

export default Inputs;
