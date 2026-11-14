import styled from "styled-components";
import { Skeleton } from "./Skeleton";




const SkeletonList = styled.div`
  margin-top: 20px;
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const SkeletonTexts = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TransactionSkeletons = ({ count }) => (
  <SkeletonList>
    {Array.from({ length: count }, (_, index) => (
      <SkeletonRow key={index}>
        <Skeleton width="40px" height="40px" radius="50%" />
        <SkeletonTexts>
          <Skeleton width="80%" height="16px" radius="4px" />
          <Skeleton width="60%" height="12px" radius="4px" />
        </SkeletonTexts>
        <Skeleton width="40px" height="40px" radius="10px" />
      </SkeletonRow>
    ))}
  </SkeletonList>
);
