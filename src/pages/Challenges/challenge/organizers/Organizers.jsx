import { useEffect, useState } from "react";
import styled from "styled-components";
import { convertToPersian, formatTime } from "../../../../services/Utility";
import Content from "./Content";
import Footer from "./Footer";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  @media (min-width: 1400px) {
    gap: 115px;
  }
`;

const Organizers = ({
  organizers,
  footers,
  shining,
  timings,
  setFirstPage,
}) => {
  const [timer, setTimer] = useState(timings ?? 0);

  useEffect(() => {
    if (timer <= 0) {
      setFirstPage(false);
      return;
    }

    const timeout = setTimeout(() => setTimer((prev) => prev - 1), 1000);

    return () => clearTimeout(timeout);
  }, [timer, setFirstPage]);

  return (
    <Wrapper>
      <Content
        organizers={organizers}
        time={convertToPersian(formatTime(timer))}
      />
      <Footer footers={footers} shining={shining} />
    </Wrapper>
  );
};

export default Organizers;
