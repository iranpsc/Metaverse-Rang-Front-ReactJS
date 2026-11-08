import styled from "styled-components";
import { Skeleton } from "./Skeleton.jsx";

const SkeletonCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const SkeletonProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SkeletonImage = styled(Skeleton)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const SkeletonTexts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const SKELETON_COUNT = 5;

export const FollowingSkeletons = () =>
  Array.from({ length: SKELETON_COUNT }, (_, index) => (
    <SkeletonCard key={index}>
      <SkeletonProfile>
        <SkeletonImage />
        <SkeletonTexts>
          <Skeleton width="120px" height="24px" radius="6px" />
          <Skeleton width="80px" height="16px" radius="4px" />
        </SkeletonTexts>
      </SkeletonProfile>
      <Skeleton width="140px" height="48px" radius="8px" />
    </SkeletonCard>
  ));
