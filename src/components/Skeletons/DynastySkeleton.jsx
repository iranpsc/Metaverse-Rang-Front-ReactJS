import styled from "styled-components";
import { Skeleton } from "./Skeleton";
const SKELETON_ROW_COUNT = 4;
const SKELETON_COLUMNS = ["50px", "100px", "60px", "60px", "80px", "60px"];

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
`;

const SkeletonBlock = styled.div`
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const SkeletonHeader = styled(SkeletonBlock)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
`;

const SkeletonCard = styled(SkeletonBlock)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SkeletonTableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
`;

export const DynastySkeleton = () => (
  <SkeletonContainer>
    <SkeletonHeader>
      <Skeleton width="100px" height="25px" radius="8px" />
      <Skeleton width="150px" height="25px" radius="20px" />
      <Skeleton width="100%" height="60px" radius="8px" />
    </SkeletonHeader>

    <SkeletonCard>
      <SkeletonTableRow>
        {SKELETON_COLUMNS.map((_, index) => (
          <Skeleton key={index} width="40px" height="40px" radius="10px" />
        ))}
      </SkeletonTableRow>

      {Array.from({ length: SKELETON_ROW_COUNT }, (_, rowIndex) => (
        <SkeletonTableRow key={rowIndex}>
          {SKELETON_COLUMNS.map((width, index) => (
            <Skeleton key={index} width={width} height="14px" radius="4px" />
          ))}
        </SkeletonTableRow>
      ))}
    </SkeletonCard>
  </SkeletonContainer>
);
