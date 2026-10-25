//دکمه به همراه ایکون استفاده شده در پروفایل
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-grow: ${({ $grow }) => ($grow ? 1 : 0)};
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 2px 20px 1px;
  border-radius: 7px;
  font-size: 16px;
  cursor: pointer;
  background-color: ${({ $fill, theme }) =>
    $fill
      ? theme.colors.primary
      : theme.colors.newColors.otherColors.btnIconBg};
  color: ${({ $fill, theme }) =>
    $fill
      ? theme.colors.newColors.primaryText
      : theme.colors.newColors.otherColors.btnIconText};

  svg {
    padding-top: 8px;
    font-size: 18px;
  }

  h3 {
    font-size: 10px;
  }

  @media (min-width: 740px) {
    h3 {
      font-size: 14px;
    }
  }

  @media (min-width: 1024px) {
    padding: 7px 20px 4px;

    h3 {
      font-size: 16px;
    }
  }
`;

const ButtonIcon = ({ icon, label, fill, grow, onclick }) => (
  <Container $fill={fill} $grow={grow} onClick={onclick}>
    <span>{icon}</span>
    <h3>{label}</h3>
  </Container>
);

export default ButtonIcon;
