// جدول یادداشت‌ها (شماره، عنوان و عملیات)؛ مناسب صفحه‌ی یادداشت‌ها؛ شماره و عنوان کنار هم، ستون عملیات با فاصله در انتها؛ در حالت لودینگ هدر ثابت می‌ماند و فقط ردیف‌ها اسکلتون می‌شوند؛ فونت و فاصله‌ها با پراپ size ریسپانسیو است
import styled, { css } from "styled-components";
import Row from "./Row";
import NotesListSkeleton from "../../../../components/Skeletons/NotesListSkeleton";
import { getTranslation } from "../../../../services/Utility";
import { getSize } from "../../../../styles/sizes";

const responsiveFont = css`
  font-size: ${({ $size }) => getSize($size, "base")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }
`;

// ستون‌های جدول: عنوان (کلید ترجمه) و عرض
// ستون اول فقط به اندازه‌ی محتوا، ستون دوم باقی فضا را می‌گیرد، ستون سوم به انتها می‌رود
const COLUMNS = [
  { title: "1357", width: "1%", align: "start" },
  { title: "1358", width: "100%", align: "start" },
  { title: "1359", width: "1%", align: "center" },
];

const TableScroller = styled.div`
  width: 100%;
  margin-top: 20px;
  overflow-x: auto;
  border-radius: 0.25rem;

  &::-webkit-scrollbar {
    display: none;
  }

  th,
  td {
    padding: 8px 10px;
    white-space: nowrap;
  }

  th,
  td h2,
  td button {
    ${responsiveFont}
  }

  td button {
    padding: 8px 12px;
  }

  /* عنوان طولانی با سه‌نقطه کوتاه می‌شود تا جدول عریض نشود */
  td:nth-child(2) {
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (min-width: 500px) and (max-width: 999px) {
    th,
    td {
      padding: 12px 14px;
    }

    td button {
      padding: 10px 16px;
    }
  }

  @media (min-width: 1000px) {
    th,
    td {
      padding: 16px 18px;
    }

    td button {
      padding: 13px 20px;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  margin-top: 5px;
  border-collapse: collapse;
  border-radius: 10px 10px 0 0;
`;

const TableHead = styled.thead`
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const TableHeader = styled.th`
  width: ${({ $width }) => $width};
  font-weight: 500;
  text-align: ${({ $align }) => $align};
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const NotesList = ({
  notes,
  isLoading,
  onNoteDeleted,
  onNoteCached,
  onNoteUpdated,
  size = "default",
}) => (
  <TableScroller $size={size}>
    <Table>
      <TableHead>
        <tr>
          {COLUMNS.map(({ title, width, align }) => (
            <TableHeader key={title} $width={width} $align={align}>
              {getTranslation(title)}
            </TableHeader>
          ))}
        </tr>
      </TableHead>

      <tbody>
        {isLoading ? (
          <NotesListSkeleton />
        ) : (
          notes.map((note) => (
            <Row
              key={note.id}
              note={note}
              onNoteDeleted={onNoteDeleted}
              onNoteCached={onNoteCached}
              onNoteUpdated={onNoteUpdated}
            />
          ))
        )}
      </tbody>
    </Table>
  </TableScroller>
);

export default NotesList;