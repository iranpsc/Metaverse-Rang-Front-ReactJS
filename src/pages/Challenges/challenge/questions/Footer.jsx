import styled from "styled-components";
import users from "../../../../assets/images/challenge/profile-2user.svg";
import view from "../../../../assets/images/challenge/eye.svg";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
import ToolTip from "../../../../components/Tooltip/Tooltip";
const ITEMS = [
  { id: "views", icon: view, translationId: "1775" },
  { id: "participants", icon: users, translationId: "1776" },
];

const Container = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Item = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};

  span {
    font-size: 16px;
    font-weight: 600;

    @media (min-width: 500px) and (max-width: 1000px) {
      font-size: 13px;
    }
  }

  img {
    width: 26px;
  }
`;

const Footer = ({ data }) => (
  <Container>
    {ITEMS.map(({ id, icon, translationId }) => (
      <ToolTip
        width="auto"
        key={id}
        place="top"
        content={getTranslation(translationId)}
        Chidren={
          <Item>
            <span>{convertToPersian(data?.[id] ?? 0)}</span>
            <img src={icon} alt="" />
          </Item>
        }
      />
    ))}
  </Container>
);

export default Footer;
