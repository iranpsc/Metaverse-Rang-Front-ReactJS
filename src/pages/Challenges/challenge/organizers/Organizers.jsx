import { useEffect, useState } from "react";
import Content from "./Content";
import Footer from "./Footer";
import styled from "styled-components";
import { convertToPersian, formatTime } from "../../../../services/Utility";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  @media (min-width: 1400px) {
    gap: 115px;
  }
`;

const Organizers = ({
  organizers,
  setFirstPage,
  footers,
  shining,
  timings,
}) => {
  const [timer, setTimer] = useState(timings);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer > 0]);

  useEffect(() => {
    if (timer === 0) {
      setFirstPage(false);
    }
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
