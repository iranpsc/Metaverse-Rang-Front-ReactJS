import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  convertToPersian,
  formatTime,
  getTranslation,
} from "../../services/Utility";
import { getItem } from "../../services/Utility/LocalStorage";
import TitleBody from "../../components/TitleBody";

const getRemainingSeconds = (endTime) =>
  Math.max(0, Math.floor((endTime - Date.now()) / 1000));

const getEndTime = () => {
  const endTime = Number(getItem("account_security")?.account_security);
  return Number.isFinite(endTime) && endTime > Date.now() ? endTime : 0;
};

const Container = styled.div``;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  border: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};

  h3,
  h4 {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  h4 {
    font-size: 16px;
    font-weight: 400;
  }
`;

const BackLink = styled.button`
  margin: 10px 0 15px;
  padding: 0;
  font-size: 15px;
  border: none;
  background: none;
  color: #008bf8;
  cursor: pointer;
`;

const ThirdStep = ({ setStep }) => {
  const [endTime] = useState(getEndTime);
  const [remaining, setRemaining] = useState(() =>
    getRemainingSeconds(endTime),
  );

  useEffect(() => {
    if (endTime <= Date.now()) {
      setStep(1);
      return;
    }

    const timeout = setTimeout(
      () => {
        const nextRemaining = getRemainingSeconds(endTime);
        setRemaining(nextRemaining);
        if (nextRemaining === 0) setStep(1);
      },
      1000,
    );

    return () => clearTimeout(timeout);
  }, [endTime, remaining, setStep]);

  return (
    <Container>
      <Card>
        <TitleBody title={getTranslation("864")} />
        <h4>
          {convertToPersian(formatTime(remaining))} {getTranslation("33")}
        </h4>
      </Card>

      <BackLink type="button" onClick={() => setStep(1)}>
        {getTranslation("35")}
      </BackLink>
    </Container>
  );
};

export default ThirdStep;
