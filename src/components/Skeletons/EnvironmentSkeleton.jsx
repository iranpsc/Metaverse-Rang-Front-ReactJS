// Placeholder image cards for the environment grid; used while environment packages are loading.
import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const Holder = styled.div`
  width: 100%;
  height: 180px;

  @media (max-width: 768px) {
    height: 120px;
  }
`;

const EnvironmentSkeleton = ({ count = 6 }) =>
  Array.from({ length: count }, (_, index) => (
    <Holder key={index}>
      <Skeleton width="100%" height="100%" radius="10px" />
    </Holder>
  ));

export default EnvironmentSkeleton;