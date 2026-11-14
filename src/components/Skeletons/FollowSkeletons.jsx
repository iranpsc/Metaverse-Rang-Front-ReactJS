// اسکلت لودینگ لیست دنبال‌کنندگان/دنبال‌شوندگان؛ مناسب نمایش کارت‌های اسکلت پروفایل با دکمه‌های اکشن در Followers و Following
import styled from "styled-components";
import { Skeleton } from "./Skeleton";

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

const SkeletonButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;

  @media (min-width: 1300px) {
    flex-direction: row;
  }
`;

const BUTTONS = {
  followers: [
    { width: "100px", height: "40px", radius: "8px" },
    { width: "80px", height: "40px", radius: "8px" },
  ],
  following: [{ width: "140px", height: "48px", radius: "8px" }],
};

const SKELETON_COUNT = 5;

const FollowSkeletons = ({ type }) =>
  Array.from({ length: SKELETON_COUNT }, (_, index) => (
    <SkeletonCard key={index}>
      <SkeletonProfile>
        <SkeletonImage />
        <SkeletonTexts>
          <Skeleton width="120px" height="24px" radius="6px" />
          <Skeleton width="80px" height="16px" radius="4px" />
        </SkeletonTexts>
      </SkeletonProfile>
      <SkeletonButtons>
        {BUTTONS[type].map((button, i) => (
          <Skeleton key={i} {...button} />
        ))}
      </SkeletonButtons>
    </SkeletonCard>
  ));

export default FollowSkeletons;