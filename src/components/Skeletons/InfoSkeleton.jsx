// اسکلتون یک آمار دنبال‌کننده/دنبال‌شونده؛ مناسب حالت لودینگ کارت اطلاعات پروفایل (Info)
import styled from "styled-components";
import { Skeleton } from "../Skeleton";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  gap: 5px;
`;

const FollowSkeleton = () => (
  <Wrapper>
    <Skeleton width="40px" height="24px" radius="4px" />
    <Skeleton width="50px" height="12px" radius="4px" />
  </Wrapper>
);

// اسکلتون کارت اطلاعات پروفایل؛ مناسب حالت لودینگ Info (نام، تاریخ ثبت‌نام، آمار دنبال‌کنندگان و دکمه)

const BORDER_COLOR = "#454545";

const Container = styled.div`
  min-width: 0;
  padding: 15px;
  border-radius: 0 0 0 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 840px) {
    padding: 12px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }

  @media (min-width: 1400px) {
    border-bottom-right-radius: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${BORDER_COLOR};
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const Divider = styled.div`
  width: 1px;
  height: 55px;
  background-color: ${BORDER_COLOR};
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 30px 0 10px;
`;

const InfoSkeleton = () => (
  <Container>
    <Header>
      <Group>
        <Skeleton width="120px" height="24px" radius="8px" />
        <Skeleton width="100px" height="16px" radius="4px" />
      </Group>
      <Skeleton width="100px" height="16px" radius="4px" />
    </Header>

    <Content>
      <FollowSkeleton />
      <Divider />
      <FollowSkeleton />
    </Content>

    <Actions>
      <Skeleton width="100%" height="40px" radius="8px" />
    </Actions>
  </Container>
);

export default InfoSkeleton;
