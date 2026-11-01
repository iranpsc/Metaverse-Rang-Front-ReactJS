import styled from "styled-components";
import { Skeleton } from "../Skeleton";

const SKELETON_COUNT = 3;

// عرض دو بلوک هر ردیف
const ROWS = [
  ["90px", "70px"],
  ["50px", "70px"],
  ["90px", "60px"],
  ["90px", "70px"],
];

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.bgContainer};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 14px;
`;

const range = (length) => Array.from({ length }, (_, index) => index);

const PropertySkeleton = () => (
  <List>
    {range(SKELETON_COUNT).map((card) => (
      <Card key={card}>
        <Header>
          <Skeleton width="60px" height="60px" radius="50%" />
          <div>
            <Skeleton
              width="120px"
              height="18px"
              radius="4px"
              style={{ marginBottom: "8px" }}
            />
            <Skeleton width="80px" height="14px" radius="4px" />
          </div>
        </Header>

        {ROWS.map(([start, end], index) => (
          <Row key={index}>
            <Skeleton width={start} height="18px" radius="4px" />
            <Skeleton width={end} height="18px" radius="4px" />
          </Row>
        ))}

        <Row>
          <Skeleton width="40%" height="44px" radius="999px" />
          <Skeleton width="60%" height="44px" radius="999px" />
        </Row>
      </Card>
    ))}
  </List>
);

export default PropertySkeleton;