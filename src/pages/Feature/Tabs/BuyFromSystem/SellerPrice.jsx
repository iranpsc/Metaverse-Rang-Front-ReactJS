import SellerPriceInfo from "./SellerPriceInfo";
import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility";
import Container from "../../../../components/Common/Container";
import TitleBody from "../../../../components/TitleBody";
const Wrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  padding-right: 15px;
  padding: 20px;
  padding-bottom: 60px;

  gap: 30px;
  width: 100%;
`;

const SellerPrice = () => {
  return (
    <Wrapper>
    <TitleBody title={getTranslation(1528)} />
      <SellerPriceInfo />
    </Wrapper>
  );
};

export default SellerPrice;
