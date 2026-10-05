import { useState, useEffect } from "react";
import styled from "styled-components";
import { FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router";
import useAuth from "../../services/Hooks/useAuth";
import { useMenuContext } from "../../services/reducers/MenuContext";
import { getTranslation, metarangUrlCitizen } from "../../services/Utility";
import Union from "./Union/Union";
import BtnsMenu from "./BtnsMenu";
import DefaultProfile from "../../assets/images/defulte-profile.png";
import Message from "../../assets/svg/message.svg?react";
import ProfileMember from "../../assets/svg/profileMember.svg";
import Ticket from "../../assets/svg/ticket.svg";
import Setting from "../../assets/svg/setting.svg";

const mobileLandscape = "@media (max-height: 500px) and (max-width: 1000px)";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  /* حداکثر ۶۰٪ ارتفاع سایدبار برای پروفایل و ساب‌منو */
  max-height: 60%;
  flex-shrink: 1;
`;


const ProfileBtn = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  height: 49px;
  border: none;
  border-radius: 10px;
  background: transparent;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "start" : "center")};
  gap: 8px;
  height: 100%;
`;

const UserImage = styled.img`
  min-width: 30px;
  height: 30px;
  margin: 5px 0;
  border: 1px solid white;
  border-radius: 100%;
`;

const Level = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.newColors.primaryText};
  font-size: 16px;
  font-weight: 700;
  line-height: 180%;
`;

const UserCode = styled.p`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  color: #868b90;
  font-size: 14px;
  font-weight: 500;
  line-height: 180%;
  text-transform: capitalize;
  white-space: nowrap;
`;

const Chevron = styled(FaChevronDown)`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  min-width: 12px;
  min-height: 12px;
  color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s ease;
  transform: ${({ $isDropOpen }) =>
    $isDropOpen ? "rotate(180deg)" : "rotate(0deg)"};
`;

const SubMenu = styled.div`
  display: ${({ $show }) => ($show ? "block" : "none")};
  margin-top: 5px;
  padding-inline-start: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  background-color: ${({ theme }) => theme.colors.newColors.primaryText};
`;

const MenuItem = styled.button`
  display: flex;
  flex-shrink: 0;
  width: 100%;
  align-items: center;
  justify-content: start;
  gap: 8px;
  height: 40px;
  padding: 0 10px;
  border: none;
  border-radius: 10px;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  line-height: 180%;
  color: #868b90;
  text-transform: capitalize;
  cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  ${mobileLandscape} {
    font-size: 14px;
  }
`;

const ItemIcon = styled.img`
  width: 22px;
`;

const MessageIcon = styled(Message)`
  fill: #868b907c;
`;

const ContainerMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  border-top: 2px solid
    ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
  background-color: ${({ theme }) => theme.colors.newColors.shades.bgOne};
`;

const Profile = () => {
  const [isDropOpen, setIsDropOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { isOpen } = useMenuContext();
  const { getUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getUser());
  }, [getUser]);

  // ساب‌منو فقط وقتی منوی اصلی بازه نمایش داده میشه؛
  // isDropOpen دست‌نخورده می‌مونه تا با باز شدن دوباره، حالت قبلی برگرده
  const showSubMenu = isOpen && isDropOpen;

  const toggleDrop = () => {
    if (isOpen) setIsDropOpen((prev) => !prev);
  };

  const handleImgError = (e) => {
    e.target.src = DefaultProfile;
  };

  const goCitizen = () => {
    if (user?.code) window.location.href = metarangUrlCitizen(user.code);
  };

  const menuItems = [
    {
      key: "documents",
      icon: <ItemIcon src={Ticket} />,
      label: getTranslation("241"),
      onClick: () => navigate("/documents"),
    },
    {
      key: "messages",
      icon: <MessageIcon />,
      label: getTranslation("242"),
      disabled: true,
    },
    {
      key: "profile",
      icon: <ItemIcon src={ProfileMember} />,
      label: getTranslation("243"),
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <ItemIcon src={Setting} />,
      label: getTranslation("642"),
      onClick: () => navigate("/settings"),
    },
    {
      key: "citizen",
      label: getTranslation("162"),
      onClick: goCitizen,
    },
  ];

  return (
    <>
      <Wrapper>
        <ProfileBtn onClick={toggleDrop}>
          <UserInfo $isOpen={isOpen}>
            <UserImage
              src={user?.image || DefaultProfile}
              onError={handleImgError}
            />
            <Level $isOpen={isOpen}>{user?.level?.slug || 0}</Level>
            <UserCode $isOpen={isOpen}>
              {user?.code?.toUpperCase() || ""}
            </UserCode>
          </UserInfo>
          <Chevron $isOpen={isOpen} $isDropOpen={isDropOpen} />
        </ProfileBtn>

        <SubMenu $show={showSubMenu}>
          {menuItems.map(({ key, icon, label, onClick, disabled }) => (
            <MenuItem
              key={key}
              $disabled={disabled}
              onClick={disabled ? undefined : onClick}
            >
              {icon}
              {label}
            </MenuItem>
          ))}
          <Union />
        </SubMenu>
      </Wrapper>

      <ContainerMain>
        <BtnsMenu />
      </ContainerMain>
    </>
  );
};

export default Profile;