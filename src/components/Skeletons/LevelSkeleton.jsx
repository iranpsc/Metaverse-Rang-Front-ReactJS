// اسکلتون کارت سطح کاربر؛ مناسب حالت لودینگ Level (عنوان، نوار پیشرفت و نگین‌های سطح)
import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const Container = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) fit-content(50%);
  align-items: center;
  margin-top: 20px;
  padding: 10px 20px 10px 15px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Percent = styled.div`
  min-width: 0;
  ${({ $isPersian }) => ($isPersian ? "border-left" : "border-right")}: 1px
    solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  ${({ $isPersian }) => ($isPersian ? "padding-left" : "padding-right")}: 25px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ProgressContainer = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
`;

const Levels = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  min-width: 100px;
`;

const LevelSkeleton = ({ isPersian }) => (
  <Container>
    <Percent $isPersian={isPersian}>
      <Title>
        <Skeleton width="120px" height="20px" radius="4px" />
        <Skeleton width="50px" height="20px" radius="4px" />
      </Title>

      <ProgressContainer>
        <Skeleton width="70%" height="8px" radius="8px" />
      </ProgressContainer>
    </Percent>

    <Levels>
      <Skeleton width="44px" height="44px" radius="50%" />
      <Skeleton width="44px" height="44px" radius="50%" />
      <Skeleton width="44px" height="44px" radius="50%" />
    </Levels>
  </Container>
);

export default LevelSkeleton;