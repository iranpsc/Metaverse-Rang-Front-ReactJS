import styled from "styled-components";
import { Skeleton } from "./Skeleton.jsx";

const Container = styled.div`
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.menuBg};
  padding: ${({ $variant }) => ($variant === "sent" ? "20px" : "10px")};
  border-radius: 10px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const Location = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const LocationDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 18px;
`;

const Pricing = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
  margin-inline-end: 35px;
`;

const SuggestionSkeleton = ({ variant = "sent" }) => (
  <Container $variant={variant}>
    <Header>
      <Location>
        <Skeleton width="100px" height="100px" radius="10px" />
        <LocationDetails>
          <Skeleton width="70px" height="20px" radius="4px" />
          <Skeleton width="60px" height="16px" radius="4px" />
        </LocationDetails>
      </Location>
      <Pricing>
        <Skeleton width="80px" height="40px" radius="8px" />
        <Skeleton width="120px" height="40px" radius="8px" />
      </Pricing>
    </Header>
    <Skeleton width="100%" height="300px" radius="10px" />
  </Container>
);

export default SuggestionSkeleton;
