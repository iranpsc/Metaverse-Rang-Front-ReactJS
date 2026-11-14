// اسکلتون اسلایدر عکس‌های پروفایل؛ مناسب حالت لودینگ Slider
import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const SliderSkeleton = () => (
  <Container>
    <Skeleton width="100%" height="100%" radius="10px" />
  </Container>
);

export default SliderSkeleton;