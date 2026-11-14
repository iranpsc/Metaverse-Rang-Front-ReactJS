import styled, { keyframes } from "styled-components";
import ProfitCard from "./ProfitCard";

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 40px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
`;

const AnimatedItem = styled.div`
  animation: ${slideUp} 0.3s ease-out;
`;

const ProfitList = ({ cards = [], disabled = false, onClick }) => (
  <List>
    {cards.map((card) => (
      <AnimatedItem key={card.id}>
        <ProfitCard
          {...card}
          disabled={disabled}
          onClick={(rect) => onClick(card, rect)}
        />
      </AnimatedItem>
    ))}
  </List>
);

export default ProfitList;