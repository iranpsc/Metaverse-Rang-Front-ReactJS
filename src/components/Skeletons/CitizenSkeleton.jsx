import styled from "styled-components";
import { Skeleton } from "./Skeleton";
const SKELETON_COUNT = 3;
const STAT_COUNT = 3;
const ACTION_COUNT = 3;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;

  @media (min-width: 1920px) {
    margin-bottom: -10px;
  }
`;

const Card = styled.div`
  display: grid;
  grid-template-columns: 10fr 1fr;
  gap: 20px;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-top: 16px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const range = (length) => Array.from({ length }, (_, index) => index);

const CitizenSkeleton = () => (
  <List>
    {range(SKELETON_COUNT).map((card) => (
      <Card key={card}>
        <Main>
          <Profile>
            <Skeleton width="50px" height="50px" radius="50%" />
            <div>
              <Skeleton
                width="120px"
                height="18px"
                radius="4px"
                style={{ marginBottom: "8px" }}
              />
              <Skeleton width="80px" height="14px" radius="4px" />
            </div>
          </Profile>

          <Stats>
            {range(STAT_COUNT).map((stat) => (
              <Stat key={stat}>
                <Skeleton width="50px" height="16px" radius="4px" />
                <Skeleton width="60px" height="16px" radius="4px" />
              </Stat>
            ))}
          </Stats>
        </Main>

        <Actions>
          {range(ACTION_COUNT).map((action) => (
            <Skeleton key={action} width="36px" height="36px" radius="1111px" />
          ))}
        </Actions>
      </Card>
    ))}
  </List>
);

export default CitizenSkeleton;