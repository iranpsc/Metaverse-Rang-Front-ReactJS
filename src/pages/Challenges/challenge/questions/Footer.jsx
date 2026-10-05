import { Tooltip as ReactTooltip } from "react-tooltip";
import { convertToPersian, getTranslation } from "../../../../services/Utility";
import styled from "styled-components";
import users from "../../../../assets/images/challenge/profile-2user.svg";
import view from "../../../../assets/images/challenge/eye.svg";

const Container = styled.div`
  display: flex;
  align-items: center;
  position: sticky;
  bottom: 0px;
  justify-content: space-between;
  gap: 10px;
  div {
    flex-grow: 1;
    background-color: ${({ theme }) =>
      theme.colors.newColors.otherColors.menuBg};
    border-radius: 4px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.newColors.shades.title};

    justify-content: end;
    gap: 8px;
    span {
      font-size: 16px;
      font-weight: 600;
    }
    img {
      width: 26px;
    }
    @media (min-width: 500px) and (max-width: 1000px) {
  font-size: 13px;
}
  }
`;

const Footer = ({ data }) => {
  const items = [
    {
      id: "views",
      count: data?.views,
      icon: view,
      tooltip: getTranslation(1775),
    },
    {
      id: "mosharekat",
      count: data?.participants,
      icon: users,
      tooltip: getTranslation(1776),
    },
  ];
  return (
    <Container>
      {items.map((item) => (
        <div key={item.id} data-tooltip-id={item.id}>
          <span>{convertToPersian(item.count ?? 0)}</span>
          <img src={item.icon} alt="" />
          <ReactTooltip
            id={item.id}
            place="top"
            content={item.tooltip}
            style={{
              borderRadius: "10px",
              width: "100px",
              textAlign: "center",
              paddingBottom: "9px",
              zIndex: "999",
            }}
          />
        </div>
      ))}
    </Container>
  );
};

export default Footer;
