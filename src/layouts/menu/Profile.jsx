import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useAuth from "../../services/Hooks/useAuth";
import { useMenuContext } from "../../services/reducers/MenuContext";
import Union from "./Union/Union";
import BtnsMenu from "./BtnsMenu";
import { FaChevronDown } from "react-icons/fa";
import DefaultProfile from "../../assets/images/defulte-profile.png";
import Message from "../../assets/svg/message.svg?react";
import ProfileMember from "../../assets/svg/profileMember.svg";
import Ticket from "../../assets/svg/ticket.svg";
import Setting from "../../assets/svg/setting.svg";
import { useNavigate } from "react-router";
import { getTranslation, metarangUrlCitizen } from "../../services/Utility";
import { useLanguage } from "../../services/reducers/LanguageContext";
const MessageIcon = styled(Message)`
  fill: #868b907c;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  align-items: center;
  width: 100%;
  height: fit-content;
  text-decoration: none;
  transition: all 0.5s ease-out;
`;

const Btn = styled.button`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  width: 100%;
  align-items: center;
  justify-content: space-around;
  gap: 8px;
  border: none;
  background: transparent;
  height: 49px;
  border-radius: 10px;
  cursor: pointer;
`;

const BtbContainer = styled.div`
  display: ${({ isHidden }) => (isHidden ? "none" : "flex")};
  width: 100%;
  align-items: center;
  justify-content: ${({ isOpen }) => (isOpen ? "start" : "center")};
  gap: 8px;
  height: 49px;
`;

const BtbContainer2 = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: start;
  gap: 8px;
  height: 49px;
`;

const BtnNavigator = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: start;
  gap: 8px;
  padding: 0 10px;
  border: none;
  background: ${({ $isOpenDrop, theme }) =>
    $isOpenDrop ? theme.colors.newColors.shades.menuBg : "transparent"};
  height: 40px;
  border-radius: 10px;
  color: #868b90;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 180%;
  text-transform: capitalize;
  cursor: pointer;

  @media (max-height: 500px) and (max-width: 1000px) {
    font-size: 14px;
  }
`;

const SubMenu = styled.div`
  display: ${({ $isOpenDrop, $isOpen }) =>
    $isOpen && $isOpenDrop ? "block" : "none"};  padding-left: 20px;
  top: ${({ $isOpen }) => ($isOpen ? "0" : "10%")};
margin-top: 5px;


  background-color: ${({ theme }) => theme.colors.newColors.primaryText};
  padding: ${({ isOpen }) => (isOpen ? "0" : "10px")};
  border-radius: ${({ isOpen }) => (isOpen ? "0" : "10px")};
  width: ${({ isOpen }) => (isOpen ? "100%" : "16.6%")};
  min-width: ${({ isOpen }) => (isOpen ? "" : "210px")};
  max-height: ${({ isOpen }) => (isOpen ? "none" : "88vh")};
  overflow-y: ${({ isOpen }) => (isOpen ? "visible" : "auto")};
`;

const Icon = styled.img`
  width: 22px;
`;

const Text = styled.p`
  color: #868b90;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 180%;
  text-transform: capitalize;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  white-space: nowrap;
`;

const ImgUser = styled.img`
  min-width: 30px;
  height: 30px;
  margin: 5px 0;
  border-radius: 100%;
  border: 1px solid white;
`;

const ContainerMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  overflow-y: auto;
    overflow-x: hidden;
  border-top: 2px solid
    ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
  background-color: ${(props) => props.theme.colors.newColors.shades.bgOne};
`;

const Level = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.newColors.primaryText};
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 180%;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const ChevronIcon = styled(FaChevronDown)`
  min-width: 12px;
  min-height: 12px;
  color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s ease;
  transform: ${({ $isOpenDrop }) =>
    $isOpenDrop ? "rotate(180deg)" : "rotate(0deg)"};
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
`;

const ChevronIcon2 = styled(FaChevronDown)`
  min-width: 12px;
  min-height: 12px;
  color: ${({ theme }) => theme.colors.primary};
  transition: transform 0.3s ease;
  transform: ${({ $isOpenDrop }) =>
    $isOpenDrop ? "rotate(180deg)" : "rotate(0deg)"};
`;

const Profile = () => {
  const [isOpenDrop, setIsOpenDrop] = useState(false);
  const { isOpen } = useMenuContext();
  const { getUser } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const isPersian = useLanguage();
const containerMainRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
  }, [getUser]);
useEffect(() => {
  if (!isOpen) setIsOpenDrop(false);
}, [isOpen]);
  const handleToggleDrop = () => {
    setIsOpenDrop((prev) => !prev);
  };
useEffect(() => {
  if (isOpenDrop && containerMainRef.current) {
    containerMainRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [isOpenDrop]);
  return (
    <>
      <Btn onClick={handleToggleDrop}>
        <BtbContainer isOpen={isOpen}>
          <ImgUser
            src={user?.image || DefaultProfile}
            onError={(e) => {
              e.target.src = DefaultProfile;
            }}
          />
          <Level isOpen={isOpen}>{user?.level?.slug || 0}</Level>
          <Text isOpen={isOpen}>{user?.code?.toUpperCase() || ""}</Text>
        </BtbContainer>
        <ChevronIcon $isOpenDrop={isOpenDrop} $isOpen={isOpen} />
      </Btn>

      <ContainerMain ref={containerMainRef}>
        <Container>
          <SubMenu
            $isOpenDrop={isOpenDrop}
            $isOpen={isOpen}
            $isPersian={isPersian}
          >
            <Btn isHidden={isOpen} onClick={handleToggleDrop}>
              <BtbContainer2>
                <ImgUser
                  src={user?.image || DefaultProfile}
                  onError={(e) => {
                    e.target.src = DefaultProfile;
                  }}
                />
                <Level isOpen={!isOpen}>{user?.level?.slug || 0}</Level>
                <Text isOpen={!isOpen}>{user?.code || ""}</Text>
              </BtbContainer2>
              <ChevronIcon2 $isOpenDrop={isOpenDrop} />
            </Btn>

            <BtnNavigator onClick={() => navigate("/documents")}>
              <Icon src={Ticket} />
              {getTranslation("241")}
            </BtnNavigator>

            <BtnNavigator style={{ color: "#868b907c", cursor: "default" }}>
              <MessageIcon />
              {getTranslation("242")}
            </BtnNavigator>

            <BtnNavigator onClick={() => navigate("/profile")}>
              <Icon src={ProfileMember} />
              {getTranslation("243")}
            </BtnNavigator>

            <BtnNavigator onClick={() => navigate("/settings")}>
              <Icon src={Setting} />
              {getTranslation("642")}
            </BtnNavigator>
            <BtnNavigator
              onClick={() => {
                if (user?.code) window.location.href = metarangUrlCitizen(user.code);
              }}
            >
              {getTranslation("162")}
            </BtnNavigator>
            <Union />
          </SubMenu>
        </Container>
        <BtnsMenu />
      </ContainerMain>
    </>
  );
};

export default Profile;
