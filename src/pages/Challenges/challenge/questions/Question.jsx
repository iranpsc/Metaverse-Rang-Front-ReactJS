import ConfettiExplosion from "react-confetti-explosion";
import { convertToPersian } from "../../../../services/Utility";
import image from "../../../../assets/gif/blue-color.gif";
import styled from "styled-components";

const CORRECT_COLOR = "#18C08F";
const WRONG_COLOR = "#C30000";

const Container = styled.div`
  position: relative;
  border-radius: 5px;
  padding: 10px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  border-bottom-color: ${({ $showCorrect, $showWrong }) => {
    if ($showCorrect) return CORRECT_COLOR;
    if ($showWrong) return WRONG_COLOR;
    return "transparent";
  }};
  background-color: ${({ theme, $showCorrect, $showWrong }) => {
    if ($showCorrect) return "#18c09021";
    if ($showWrong) return "#ff000021";
    return theme.colors.newColors.otherColors.menuBg;
  }};
  box-shadow: ${({ $showCorrect, $showWrong }) => {
    if ($showCorrect) return "0px 30px 20px -20px #18C08F33";
    if ($showWrong) return "0px 30px 20px -20px #FF000033";
    return "none";
  }};
  @media (min-width: 500px) and (max-width: 1000px) {
  padding: 5px;
}
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
    @media (min-width: 500px) and (max-width: 1000px) {
  gap: 5px;
}
`;

const Photo = styled.div`
  width: 40px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  padding: 0 13px;
  border: ${({ $showCorrect }) =>
    $showCorrect ? "1px solid #ffffff" : "none"};
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg3};

  img {
    min-width: 40px;
    min-height: 40px;
  }
`;

const Percent = styled.div`
  flex-grow: 1;
`;

const OptionTitle = styled.h3`
  font-size: 16px;
  font-weight: 400;
  max-width: 320px;
  line-height: 28px;
  color: ${({ $showCorrect, $showWrong }) => {
    if ($showCorrect) return CORRECT_COLOR;
    if ($showWrong) return WRONG_COLOR;
    return "inherit";
  }};
@media (min-width: 500px) and (max-width: 1000px) {
  font-size: 13px;
}
`;

const PercentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  span {
    color: #a0a0ab;
    font-size: 13px;
    font-weight: 500;
    @media (min-width: 500px) and (max-width: 1000px) {
  font-size: 13px;
}
  }
  
`;

const Progress = styled.div`
  background-color: #ffffff;
  border-radius: 30px;
  position: relative;
  flex-grow: 1;
  height: 4px;

  div {
    height: 100%;
    position: absolute;
    background-color: ${({ $showWrong }) =>
      $showWrong ? WRONG_COLOR : CORRECT_COLOR};
  }
`;

const Question = ({
  id,
  questionID,
  title,
  status,
  percent,
  showAnswer,
  selectedAnswerId,
  onSelectAnswer,
}) => {
  const isSelected = selectedAnswerId === id;
  const isCorrectOption = status;
  const showCorrect = showAnswer && isCorrectOption;
  const showWrong = showAnswer && isSelected && !isCorrectOption;
  const isDisabled = !!selectedAnswerId;

  const handleSelect = () => {
    if (isDisabled || showAnswer) return;
    onSelectAnswer(questionID, id);
  };

  return (
    <Container
      $disabled={isDisabled}
      $showCorrect={showCorrect}
      $showWrong={showWrong}
      onClick={handleSelect}
    >
      {showAnswer && isSelected && (
        <ConfettiExplosion
          style={{ position: "absolute", top: "50px", left: "200px" }}
          particleSize={5}
          zIndex={9999}
          width={400}
          height="100vh"
          colors={[isCorrectOption ? CORRECT_COLOR : WRONG_COLOR]}
        />
      )}
      <Wrapper>
        <Photo $showCorrect={showCorrect}>
          <img src={image} alt={title} width={40} height={40} />
        </Photo>
        <Percent>
          <OptionTitle $showCorrect={showCorrect} $showWrong={showWrong}>
            {convertToPersian(title)}
          </OptionTitle>
          {showAnswer && (
            <PercentWrapper>
              <Progress $showWrong={showWrong}>
                <div
                  style={{
                    width: `${percent}%`,
                    backgroundColor: isCorrectOption
                      ? CORRECT_COLOR
                      : "#FF0000",
                  }}
                />
              </Progress>
              <span>
                {percent
                  .toLocaleString()
                  .replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d])}
                %
              </span>
            </PercentWrapper>
          )}
        </Percent>
      </Wrapper>
    </Container>
  );
};

export default Question;
