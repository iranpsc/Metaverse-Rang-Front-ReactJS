import ConfettiExplosion from "react-confetti-explosion";
import styled, { css } from "styled-components";
import image from "../../../../assets/gif/blue-color.gif";
import { convertToPersian } from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody";
const CORRECT_COLOR = "#18C08F";
const WRONG_COLOR = "#C30000";

// وضعیت گزینه => رنگ‌ها
const STATES = {
  correct: {
    color: CORRECT_COLOR,
    background: "#18c09021",
    shadow: "0px 30px 20px -20px #18C08F33",
  },
  wrong: {
    color: WRONG_COLOR,
    background: "#ff000021",
    shadow: "0px 30px 20px -20px #FF000033",
  },
};

const compactOnly = (styles) => css`
  @media (min-width: 500px) and (max-width: 1000px) {
    ${styles}
  }
`;

const Container = styled.div`
  position: relative;
  padding: 10px;
  border-radius: 5px;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  border-bottom-color: ${({ $state }) =>
    STATES[$state]?.color ?? "transparent"};
  background-color: ${({ theme, $state }) =>
    STATES[$state]?.background ?? theme.colors.newColors.otherColors.menuBg};
  box-shadow: ${({ $state }) => STATES[$state]?.shadow ?? "none"};

  ${compactOnly("padding: 5px;")}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  ${compactOnly("gap: 5px;")}
`;

const Photo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 60px;
  padding: 0 13px;
  border-radius: 5px;
  border: ${({ $state }) =>
    $state === "correct" ? "1px solid #ffffff" : "none"};
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg3};

  img {
    min-width: 40px;
    min-height: 40px;
  }
`;

const Body = styled.div`
  flex-grow: 1;
`;


const PercentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  span {
    font-size: 13px;
    font-weight: 500;
    color: #a0a0ab;
  }
`;

const Progress = styled.div`
  position: relative;
  flex-grow: 1;
  height: 4px;
  border-radius: 30px;
  background-color: #ffffff;
`;

const ProgressBar = styled.div`
  position: absolute;
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${({ $state }) => STATES[$state]?.color ?? CORRECT_COLOR};
`;

const confettiStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};

const getState = ({ showAnswer, isSelected, isCorrect }) => {
  if (!showAnswer) return null;
  if (isCorrect) return "correct";
  if (isSelected) return "wrong";
  return null;
};

const Question = ({
  id,
  questionID,
  title,
  status: isCorrect,
  percent,
  showAnswer,
  selectedAnswerId,
  onSelectAnswer,
}) => {
  const isSelected = selectedAnswerId === id;
  const isDisabled = Boolean(selectedAnswerId);
  const state = getState({ showAnswer, isSelected, isCorrect });

  const handleSelect = () => {
    if (isDisabled) return;
    onSelectAnswer(questionID, id);
  };

  return (
    <Container $disabled={isDisabled} $state={state} onClick={handleSelect}>
      {showAnswer && isSelected && (
        <ConfettiExplosion
          style={confettiStyle}
          particleSize={5}
          zIndex={9999}
          width={400}
          height="100vh"
          colors={[isCorrect ? CORRECT_COLOR : WRONG_COLOR]}
        />
      )}

      <Row>
        <Photo $state={state}>
          <img src={image} alt={title} width={40} height={40} />
        </Photo>

        <Body>
          <TitleBody title={convertToPersian(title)} />

          {showAnswer && (
            <PercentRow>
              <Progress>
                <ProgressBar $percent={percent} $state={state} />
              </Progress>
              <TitleBody title={`${convertToPersian(percent)}%`} />
            </PercentRow>
          )}
        </Body>
      </Row>
    </Container>
  );
};

export default Question;
