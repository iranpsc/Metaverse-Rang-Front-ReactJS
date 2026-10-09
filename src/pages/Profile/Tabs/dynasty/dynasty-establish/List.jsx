import Row from "./Row";
import cav from "../../../../../assets/gif/cav.gif";
import gif from "../../../../../assets/gif/satisfaction.gif";
import limit from "../../../../../assets/gif/limit-of-influence.gif";
import psc from "../../../../../assets/gif/psc.gif";
import pscplus from "../../../../../assets/gif/pscplus.gif";
import rial from "../../../../../assets/gif/rial.gif";
import styled from "styled-components";

const HEADER_ICONS = [
  { alt: "limit", src: limit },
  { alt: "psc", src: psc },
  { alt: "pscplus", src: pscplus },
  { alt: "cav", src: cav },
  { alt: "rial", src: rial },
  { alt: "gif", src: gif },
];

const Container = styled.div`
  border-radius: 0.25rem;
  margin-top: 20px;
`;

// برای اسکرول افقی روی موبایل
const TableWrapper = styled.div`
  width: 100%;
  -webkit-overflow-scrolling: touch;
  border-radius: 10px;
`;

const Table = styled.table`
  margin-top: 5px;
  border-collapse: collapse;

  width: 100%;
  min-width: 500px;

  @media (max-height: 768px) {
    min-width: 0px;
  }
`;

const TableHead = styled.thead`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px !important;
  overflow: hidden !important;
`;

const TableRow = styled.tr``;

const TableHeader = styled.th`
  padding: 20px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.newColors.otherColors.text};
  position: relative;
  padding-bottom: 10px;
  text-align: center;

  &:nth-of-type(2) {
    padding-right: 45px;
  }

  div {
    width: fit-content;
  }

  img {
    width: 30px;
    height: 30px;
  }

  @media (max-height: 768px) {
    padding: 12px 8px 8px;

    &:nth-of-type(2) {
      padding-right: 20px;
    }

    img {
      width: 22px;
      height: 22px;
    }
  }
`;

const List = ({ members }) => {
  return (
    <Container>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              {HEADER_ICONS.map(({ alt, src }) => (
                <TableHeader key={alt}>
                  <div>
                    <img alt={alt} src={src} loading="lazy" />
                  </div>
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <tbody>
            {members.map((member) => (
              <Row key={member.id} {...member} />
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default List;