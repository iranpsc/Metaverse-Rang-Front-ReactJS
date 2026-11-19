import styled from "styled-components";
import TitleHeader from "../../../../components/TitleHeader";
import Question from "./Question";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
  @media (max-width: 1024px) {
    gap: 8px;
  }
`;

const Content = ({
  question: { title, questionID, options },
  showAnswer,
  selectedAnswerId,
  onSelectAnswer,
}) => (
  <Container>
    <TitleHeader noMargin small right title={title} />

    <Options>
      {options.map(({ id, title, status, percent }) => (
        <Question
          key={id}
          id={id}
          title={title}
          status={status}
          percent={percent}
          questionID={questionID}
          showAnswer={showAnswer}
          selectedAnswerId={selectedAnswerId}
          onSelectAnswer={onSelectAnswer}
        />
      ))}
    </Options>
  </Container>
);

export default Content;
