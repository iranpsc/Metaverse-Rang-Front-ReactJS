import TitleHeader from "../../../../../components/TitleHeader";
import { getTranslation } from "../../../../../services/Utility";
import Details from "./Details";
import Model3D from "./Model3D";
import styled from "styled-components";
const Wrapper = styled.div`
  padding: 20px;
  margin-top: 20px;

  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  display: grid;
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;
const Owner = ({ data }) => {
  return (
    <div>
      <TitleHeader title={getTranslation(819)} />
      <Wrapper>
        <Model3D data={data} />
        <Details data={data} />
      </Wrapper>
    </div>
  );
};

export default Owner;
