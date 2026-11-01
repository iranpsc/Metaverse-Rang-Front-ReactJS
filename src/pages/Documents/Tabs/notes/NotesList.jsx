import styled from "styled-components";
import Row from "./Row";
import { getTranslation } from "../../../../services/Utility";
import { Skeleton } from "../../../../components/Skeleton";

const SKELETON_ROWS = 4;

const Container = styled.div`
  border-radius: 0.25rem;
  overflow-x: auto;
  margin-top: 20px;
  &::-webkit-scrollbar {
    display: none;
  }
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
  border-radius: 10px;
`;

const TableHeader = styled.th`
  padding: 20px 10px 10px;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  position: relative;
  text-align: center;
  width: ${({ $width }) => $width};

  div {
    width: fit-content;
  }
`;

const SkeletonRow = styled.tr`
  td {
    padding: 15px 20px;
    border-bottom: 1px solid #454545;
    text-align: center;
  }
`;

const SkeletonActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

// ستون‌های جدول: عنوان (کلید ترجمه)، عرض و اسکلتون مخصوص هر ستون
const COLUMNS = [
  {
    title: "1357",
    width: "100px",
    skeleton: <Skeleton width="50px" height="18px" radius="4px" />,
  },
  {
    title: "1358",
    width: "350px",
    skeleton: <Skeleton width="230px" height="18px" radius="4px" />,
  },
  {
    title: "1359",
    width: "210px",
    skeleton: (
      <SkeletonActions>
        <Skeleton width="64px" height="50px" radius="8px" />
        <Skeleton width="97.3px" height="50px" radius="8px" />
      </SkeletonActions>
    ),
  },
];

// این کامپوننت برای نمایش جدول یادداشت‌ها (شماره، عنوان و عملیات) استفاده میشه؛ در حالت لودینگ هدر ثابت می‌مونه و فقط ردیف‌ها اسکلتون می‌شن
const NotesList = ({
  notes,
  isLoading,
  onNoteDeleted,
  onNoteCached,
  onNoteUpdated,
}) => (
  <Container>
    <Table>
      <TableHead>
        <tr>
          {COLUMNS.map(({ title, width }) => (
            <TableHeader key={title} $width={width}>
              <div>{getTranslation(title)}</div>
            </TableHeader>
          ))}
        </tr>
      </TableHead>

      <tbody>
        {isLoading
          ? Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <SkeletonRow key={index}>
                {COLUMNS.map(({ title, skeleton }) => (
                  <td key={title}>{skeleton}</td>
                ))}
              </SkeletonRow>
            ))
          : notes.map((note) => (
              <Row
                key={note.id}
                {...note}
                note={note}
                onNoteDeleted={onNoteDeleted}
                onNoteCached={onNoteCached}
                onNoteUpdated={onNoteUpdated}
              />
            ))}
      </tbody>
    </Table>
  </Container>
);

export default NotesList;
