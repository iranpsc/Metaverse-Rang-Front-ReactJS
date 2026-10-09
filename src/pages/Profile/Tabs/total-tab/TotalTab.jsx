import { useEffect, useRef } from "react";
import Bio from "./Bio";
import Details from "./Details";
import styled from "styled-components";
import { useScrollDirection } from "../../../../hooks/useScrollDirection";
import { useScrollDirectionContext } from "../../../../services/reducers/ScrollDirectionContext";

const Container = styled.div`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 15px;
  overflow-y: auto;
    overflow-x: hidden;

  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 30px;
  padding-bottom: 60px;

  @media (min-width: 1400px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  }
`;

const TotalTab = () => {
  const ref = useRef(null);
  const isScrollingDown = useScrollDirection(ref);
  const { updateScrollDirection } = useScrollDirectionContext();

  useEffect(() => {
    updateScrollDirection(isScrollingDown);
  }, [isScrollingDown, updateScrollDirection]);

  return (
    <Container ref={ref}>
      <Bio />
      <Details />
    </Container>
  );
};

export default TotalTab;
