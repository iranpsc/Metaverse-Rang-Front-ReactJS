import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const SKELETON_COUNT = 3;

const Card = styled.div`
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  margin-bottom: 10px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NotificationsSkeleton = ({ count = SKELETON_COUNT }) =>
  Array.from({ length: count }, (_, index) => (
    <Card key={index}>
      <Header>
        <Profile>
          <Skeleton width="60px" height="60px" radius="50%" />
          <div>
            <Skeleton
              width="120px"
              height="20px"
              radius="4px"
              style={{ marginBottom: "8px" }}
            />
            <Skeleton width="150px" height="14px" radius="4px" />
          </div>
        </Profile>
        <Skeleton width="35px" height="35px" radius="50%" />
      </Header>
      <Skeleton width="100%" height="30px" radius="4px" />
    </Card>
  ));

export default NotificationsSkeleton;