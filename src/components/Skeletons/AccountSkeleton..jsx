import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SkeletonCheck = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SkeletonDivider = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 15px;
  border-bottom: 1px solid #454545;
`;

// اسکلتون کارت تغییر شماره موبایل
const ChangeCardSkeleton = () => (
  <SkeletonCard>
    <Skeleton width="250px" height="24px" radius="4px" />
    <Skeleton width="200px" height="14px" radius="4px" />

    <SkeletonRow>
      <Skeleton width="120px" height="16px" radius="4px" />
      <Skeleton width="80px" height="16px" radius="4px" />
    </SkeletonRow>

    <SkeletonRow>
      <Skeleton width="60px" height="16px" radius="4px" />
      <Skeleton width="80px" height="16px" radius="4px" />
    </SkeletonRow>

    <SkeletonCheck>
      <Skeleton width="20px" height="20px" radius="4px" />
      <Skeleton width="80px" height="16px" radius="4px" />
    </SkeletonCheck>
  </SkeletonCard>
);

// اسکلتون کارت اطلاعات بانکی
const BankSkeleton = () => (
  <SkeletonCard>
    <Skeleton width="150px" height="24px" radius="4px" />

    <SkeletonDivider>
      <SkeletonRow>
        <Skeleton width="100px" height="16px" radius="4px" />
        <Skeleton width="40px" height="20px" radius="4px" />
      </SkeletonRow>
    </SkeletonDivider>

    <SkeletonDivider>
      <Skeleton width="130px" height="16px" radius="4px" />
      <SkeletonRow>
        <Skeleton width="140px" height="14px" radius="4px" />
        <Skeleton width="40px" height="20px" radius="4px" />
      </SkeletonRow>
    </SkeletonDivider>

    <SkeletonDivider>
      <SkeletonRow>
        <Skeleton width="200px" height="16px" radius="4px" />
        <Skeleton width="40px" height="20px" radius="4px" />
      </SkeletonRow>
    </SkeletonDivider>

    <Skeleton width="100%" height="45px" radius="8px" />
  </SkeletonCard>
);

export const AccountSkeleton = () => (
  <>
    <ChangeCardSkeleton />
    <BankSkeleton />
  </>
);
