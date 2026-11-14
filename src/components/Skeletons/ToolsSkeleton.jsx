import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const SKELETON_COUNT = 3;

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Product = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Lines = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TextLines = () => (
  <Lines>
    <Skeleton width="70px" height="18px" radius="4px" />
    <Skeleton width="70px" height="18px" radius="4px" />
  </Lines>
);

const ToolsSkeleton = ({ count = SKELETON_COUNT }) =>
  Array.from({ length: count }, (_, index) => (
    <Card key={index}>
      <Product>
        <Skeleton width="50px" height="60px" radius="8px" />
        <TextLines />
      </Product>
      <TextLines />
      <TextLines />
      <Skeleton width="76px" height="50px" radius="8px" />
    </Card>
  ));

export default ToolsSkeleton;