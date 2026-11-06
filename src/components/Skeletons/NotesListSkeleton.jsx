// اسکلتون ردیف‌های جدول یادداشت‌ها؛ مناسب حالت لودینگ NotesList (هدر جدول ثابت می‌ماند و فقط ردیف‌ها اسکلتون می‌شوند)
import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const ROWS = 4;

const Row = styled.tr`
  td {
    padding: 15px 20px;
    border-bottom: 1px solid #454545;
    text-align: center;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const NotesListSkeleton = () =>
  Array.from({ length: ROWS }, (_, index) => (
    <Row key={index}>
      <td>
        <Skeleton width="50px" height="18px" radius="4px" />
      </td>
      <td>
        <Skeleton width="230px" height="18px" radius="4px" />
      </td>
      <td>
        <Actions>
          <Skeleton width="64px" height="50px" radius="8px" />
          <Skeleton width="97.3px" height="50px" radius="8px" />
        </Actions>
      </td>
    </Row>
  ));

export default NotesListSkeleton;