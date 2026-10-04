import styled from "styled-components";

const TitleName = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 600;
  margin-top: ${(props) => props.payed && "30px"};
  font-size: ${(props) => props.size? "13px" : "16px"};
  @media (min-width: 1280px) {
    font-size: 18px;
  }
`;
const Title = ({ title, payed, right,small }) => {
  return (
    <TitleName $right={right} $payed={payed} $size={small}>
      {title}
    </TitleName>
  );
};

export default Title;
