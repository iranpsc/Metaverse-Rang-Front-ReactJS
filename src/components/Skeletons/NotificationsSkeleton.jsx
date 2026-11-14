import styled from "styled-components";
import { Skeleton } from "./Skeleton";
import { scale } from "../../styles/sizes";

const SKELETON_COUNT = 3;

const Card = styled.div`
  box-sizing: border-box;
  width: 100%;
  ${scale("padding", { base: "10px", tablet: "14px", laptop: "20px" })}
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  margin-bottom: 10px;

  @media (min-width: 500px) {
    gap: 12px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  @media (min-width: 500px) {
    gap: 12px;
  }
`;

const Avatar = styled.div`
  flex: 0 0 auto;
  ${scale("width", { base: "40px", tablet: "50px", laptop: "60px" })}
  ${scale("height", { base: "40px", tablet: "50px", laptop: "60px" })}
`;

const SenderInfo = styled.div`
  min-width: 0;
  ${scale("width", { base: "100px", tablet: "120px", laptop: "150px" })}
`;

const DeleteButton = styled.div`
  flex: 0 0 auto;
  ${scale("width", { base: "30px", tablet: "34px", laptop: "35px" })}
  ${scale("height", { base: "30px", tablet: "34px", laptop: "35px" })}
`;

const NotificationsSkeleton = ({ count = SKELETON_COUNT }) =>
  Array.from({ length: count }, (_, index) => (
    <Card key={index}>
      <Header>
        <Profile>
          <Avatar>
            <Skeleton width="100%" height="100%" radius="50%" />
          </Avatar>
          <SenderInfo>
            <Skeleton
              width="100%"
              height="20px"
              radius="4px"
              style={{ marginBottom: "8px" }}
            />
            <Skeleton width="100%" height="14px" radius="4px" />
          </SenderInfo>
        </Profile>
        <DeleteButton>
          <Skeleton width="100%" height="100%" radius="50%" />
        </DeleteButton>
      </Header>
      <Skeleton width="100%" height="30px" radius="4px" />
    </Card>
  ));

export default NotificationsSkeleton;