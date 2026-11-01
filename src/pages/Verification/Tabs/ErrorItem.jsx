import { BsExclamationOctagon } from "react-icons/bs";
import styled from "styled-components";
import TitleBody from "../../../components/TitleBody";

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border-radius: 5px;
  padding: 15px;
  svg {
    color: #c30000;
    font-size: 22px;
  }
`;
const ErrorItem = ({ item }) => {
  return (
    <Container>
      <BsExclamationOctagon />
      <TitleBody title={item} />
    </Container>
  );
};

export default ErrorItem;
