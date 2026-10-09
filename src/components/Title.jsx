import styled from "styled-components";

const SIZES = {
  default: { base: "16px", desktop: "18px" },
  small: { base: "13px", desktop: "14px" },
};

const TitleName = styled.h3`
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-size: ${({ $small }) => (SIZES[$small ? "small" : "default"].base)};
  font-weight: 600;
  margin-top: ${({ $payed }) => ($payed ? "30px" : "0")};

  @media (min-width: 500px) and (max-width: 1000px) {
    font-size: 13px;
  }

  @media (min-width: 1280px) {
    font-size: ${({ $small }) => SIZES[$small ? "small" : "default"].desktop};
  }
`;

const Title = ({ title, payed, small }) => {
  return (
    <TitleName $payed={payed} $small={small}>
      {title}
    </TitleName>
  );
};

export default Title;