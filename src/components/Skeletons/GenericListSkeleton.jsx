// اسکلتون لودینگ ردیف‌های جدول GenericList؛ بر اساس skeleton هر ستون سلول می‌سازد

import styled from "styled-components";
import { Skeleton } from "./Skeleton.jsx";

const SkeletonRow = styled.tr`
  td {
    padding: 15px 20px;
    border-bottom: 1px solid #454545;
  }
`;

const SkeletonCell = styled(Skeleton)`
  margin-right: auto;
  margin-left: auto;
`;

const GenericListSkeleton = ({ columns, rowsCount = 5 }) =>
  Array.from({ length: rowsCount }, (_, index) => (
    <SkeletonRow key={index}>
      {columns.map(({ title, skeleton }) => (
        <td key={title}>
          <SkeletonCell {...skeleton} />
        </td>
      ))}
    </SkeletonRow>
  ));

export default GenericListSkeleton;