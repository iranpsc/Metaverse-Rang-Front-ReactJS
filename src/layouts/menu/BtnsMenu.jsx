import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { getTranslation, convertToPersian, formatNumber } from "../../services/Utility";
import AccountSecurityIcon from "../../assets/svg/accountSecurity.svg";
import CentralSearch from "../../assets/svg/centralSearch.svg";
import GlobalStatisticsIcon from "../../assets/svg/globalStatistics.svg";
import RobotIcon from "../../assets/svg/robot.svg";
import ProfitIcon from "../../assets/svg/profit.svg";
import KycIcon from "../../assets/svg/kyc.svg";
import CalendarIcon from "../../assets/svg/calendar.svg";
import StoreIcon from "../../assets/svg/store.svg";
import NotifIcon from "../../assets/svg/notif.svg";
import ReportIcon from "../../assets/svg/report.svg";
import Wallet from "../../assets/svg/wallet.svg";
import GiftIcon from "../../assets/svg/gifts.svg";
import LogoutIcon from "../../assets/svg/logout.svg";
import { useMenuContext } from "../../services/reducers/MenuContext";
import { useNavigate, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { UserContext } from "../../services/reducers/UserContext";
import ToolTip from "../../components/Tooltip";
import useRequest from "../../services/Hooks/useRequest";
import { removeItem } from "../../services/Utility/LocalStorage";

const Container = styled.div`
  height: 100vh;
  white-space: nowrap;
`;
const Btn = styled.button`
  display: flex;
  width: 100%;
  background-color: transparent;
  align-items: center;
  justify-content: ${(props) => (props.isOpen ? "space-between" : "center")};
  gap: 16.865px;
  padding: 0 10px;
  border: none;
  height: 46px;
  filter: ${(props) => (props.disabled ? "opacity(0.5)" : "none")};
  & div {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
  }
  position: ${(props) => (props.isOpen ? "inherit" : "relative")};
  background-color: ${(props) =>
    props.isSelected
      ? props.theme.colors.newColors.otherColors.iconBackground
      : "transparent"};
      &:hover{
border-radius:10px ;

   background-color: ${(props) =>
    props.isDanger ? "rgba(224, 49, 49, 0.12)" : "transparent"};      }
`;
const Icon = styled.img`
  width: 20px;
  height: 40px;
  filter: ${(props) => {
    if (props.isDanger) {
      return "brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(5000%) hue-rotate(350deg) brightness(90%) contrast(95%)";
    }

    if (props.isCompleted) {
      return "brightness(0) saturate(100%) invert(44%) sepia(96%) saturate(1400%) hue-rotate(85deg) brightness(90%) contrast(100%)";
    }

    if (props.isSelected) {
      return "brightness(0) saturate(100%) invert(42%) sepia(39%) saturate(580%) hue-rotate(114deg) brightness(95%) contrast(89%)";
    }

    return "none";
  }};
`;

const Text = styled.p`
  color: ${(props) => {
    if (props.isDanger) return "#e03131";
    return props.isSelected
      ? props.theme.colors.newColors.otherColors.iconText
      : "#868b90";
  }};
  font-style: normal;
  font-weight: 500;
  line-height: 180%;
  font-size: 14px;
  @media (min-width: 1024px) {
    font-size: 16px;
  }
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const ValueBtn = styled.span`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #c90f0fff;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  position: ${(props) => (props.isOpen ? "inherit" : "absolute")};
  left: 1px;
  top: -3px;
`;

const BtnsMenu = () => {
  const { isOpen } = useMenuContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(null);
  const lang = useTranslation();
  const [user] = useContext(UserContext);
  const { Request, HTTP_METHOD } = useRequest();

  useEffect(() => {
    const currentItem = menuItems.find(
      (item) => item.navigate && `/${item.navigate}` === location.pathname,
    );
    if (currentItem) {
      setSelectedItem(currentItem.translationId);
    } else {
      setSelectedItem(null);
    }
  }, [location.pathname]);

  const logoutHandler = () => {
    Request("auth/logout", HTTP_METHOD.POST, {}, {}, "development")
      .then(() => {
        removeItem("user");
        window.location.reload();
      })
      .catch((err) => {
        console.error("logout error", err);
      });
  };

  const handleClick = (item) => {
    if (item.onClick) {
      item.onClick();
      return;
    }

    if (!item.navigate) return;

    const targetPath = `/${item.navigate}`;

    if (location.pathname.startsWith(targetPath)) {
      return;
    }

    setSelectedItem(item.translationId);
    navigate(targetPath);
  };

  const menuItems = [
    { icon: GiftIcon, translationId: "231", navigate: "challenges" },

    ...(!user?.wallet_login
      ? [
        {
          icon: AccountSecurityIcon,
          translationId: "31",
          navigate: "confirmation",
        },
      ]
      : []),

    {
      icon: CentralSearch,
      translationId: "232",
      navigate: "search/citizen",
    },
    {
      icon: GlobalStatisticsIcon,
      translationId: "233",
      navigate: "",
    },
    {
      icon: RobotIcon,
      translationId: "235",
      navigate: "",
    },
    {
      icon: ProfitIcon,
      translationId: "236",
      navigate: "profit",
    },
    {
      icon: KycIcon,
      translationId: "237",
      navigate: "verification",
    },
    {
      icon: CalendarIcon,
      translationId: "262",
      navigate: "",
    },
    {
      icon: StoreIcon,
      translationId: "30",
      navigate: "store",
    },
    {
      icon: NotifIcon,
      translationId: "238",
      navigate: "notifications",
    },
    {
      icon: ReportIcon,
      translationId: "23",
      navigate: "report",
    },
    {
      icon: Wallet,
      translationId: user?.has_wallet ? "1781" : "1668",
      navigate: "connectWallet",
    },
    {
      icon: LogoutIcon,
      translationId: "230",
      onClick: logoutHandler,
      isDanger: true,

    },
  ];

  return (
    <Container>
      {menuItems.map((item, index) => (
        <ToolTip
          key={index}
          lang={lang.i18n.language}
          place="left"
          disabled={isOpen}
          ContentToltip={getTranslation(item.translationId)}
          Chidren={
            <Btn
              isOpen={isOpen}
              isSelected={selectedItem === item.translationId}
              onClick={() => handleClick(item)}
              isDanger={item.isDanger}

              disabled={
                !item.onClick &&
                item.navigate === "" &&
                item.translationId !== "sign out"
              }
            >
              <div>
                <Icon
                  src={item.icon}
                  isSelected={selectedItem === item.translationId}
                  isCompleted={item.navigate == "connectWallet" && user?.has_wallet}
                  isDanger={item.isDanger}
                />
                <Text
                  isOpen={isOpen}
                  isSelected={selectedItem === item.translationId}
                  isDanger={item.isDanger}
                >
                  {getTranslation(item.translationId)}
                </Text>
              </div>
              {item.translationId === "236" && user && (
                <ValueBtn isOpen={isOpen}>
                  %{convertToPersian(formatNumber(user.hourly_profit_time_percentage, 1))}
                </ValueBtn>
              )}
              {item.translationId === "238" && user && (
                <ValueBtn isOpen={isOpen}>
                  {convertToPersian(user.unread_notifications_count)}
                </ValueBtn>
              )}
            </Btn>
          }
        />
      ))}
    </Container>
  );
};

export default BtnsMenu;