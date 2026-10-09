import styled from "styled-components";
import {
  convertToPersian,
  getTranslation,
} from "../../../../../services/Utility";

const RELATIONS = {
  125: ["پدر", "father"],
  126: ["مادر", "mother"],
  127: ["خواهر", "sister"],
  128: ["برادر", "brother"],
  129: ["فرزند", "child"],
  130: ["شوهر", "husband"],
  825: ["زن", "wife"],
};

const RELATION_MAP = Object.fromEntries(
  Object.entries(RELATIONS).flatMap(([id, keys]) =>
    keys.map((key) => [key, Number(id)]),
  ),
);

const translateRelation = (name) => {
  const id = RELATION_MAP[String(name ?? "").trim().toLowerCase()];
  return id ? getTranslation(id) : name;
};

const TableRow = styled.tr`
  background-color: transparent;
  transition: background-color 0.2s ease-in-out;
`;

const TableCell = styled.td`
  padding: 15px 20px 15px 30px;
  border-bottom: 1px solid #454545;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  white-space: nowrap;

  @media (max-height: 768px) {
    padding: 10px 10px 10px 8px;
  }
`;

const Code = styled.h2`
  font-size: 16px;
  font-weight: 500;
  margin: 0;

  @media (max-height: 768px) {
    font-size: 13px;
  }
`;

const Row = ({
  name = "",
  psc = "",
  plus = "",
  cage = "",
  rial = "",
  gif = "",
}) => {
  const cells = [
    translateRelation(name),
    convertToPersian(psc),
    convertToPersian(plus),
    convertToPersian(cage),
    convertToPersian(rial),
    gif,
  ];

  return (
    <TableRow>
      {cells.map((value, index) => (
        <TableCell key={index}>
          <Code>{value}</Code>
        </TableCell>
      ))}
    </TableRow>
  );
};

export default Row;