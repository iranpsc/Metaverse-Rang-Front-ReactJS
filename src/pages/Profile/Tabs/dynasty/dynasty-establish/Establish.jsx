import styled from "styled-components";
import TitleHeader from "../../../../../components/TitleHeader";
import { getTranslation } from "../../../../../services/Utility";
import List from "./List";
import TitleBody from "../../../../../components/TitleBody";
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Top = styled.div`
  p {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    font-weight: 400;
    font-size: 16px;
    margin: 0;
  }
`;

const Establish = ({ members }) => {
  return (
    <Container>
      <Top>
        <TitleHeader title={getTranslation(807)} />
        <TitleBody title={getTranslation(806)} />
        <TitleBody title={getTranslation(808)} />
      </Top>

      <List members={members} />
    </Container>
  );
};

export default Establish;
