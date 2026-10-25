import styled from "styled-components";
import { getTranslation } from "../../services/Utility";
import HomeIcon from "../../assets/svg/home.svg";
import NewsIcon from "../../assets/svg/news.svg";
import BlogIcon from "../../assets/svg/blogs.svg";
import TrainingIcon from "../../assets/svg/training.svg";
import RobotIcon from "../../assets/svg/robot.svg";
import AboutIcon from "../../assets/svg/about.svg";
import ContactIcon from "../../assets/svg/contact.svg";
import CitizenIcon from "../../assets/svg/profileMember.svg";
import CalendarIcon from "../../assets/svg/calendar.svg";
import { useMenuContext } from "../../hooks/useMenuContext.js";
import ToolTip from "../../components/Tooltip";

import i18n from "../../i18n/i18n";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  white-space: nowrap;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colors.primary};
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.colors.primary};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #999;
  }

  margin-bottom: auto;
  margin-top: 25px;
`;

const Btn = styled.a`
  display: flex;
  width: 100%;
  background-color: transparent;
  align-items: center;
  justify-content: ${(props) => (props.$isOpen ? "start" : "center")};
  gap: 16.865px;
  padding: 0 10px;
  border: none;
  height: 46px;
`;

const Icon = styled.img`
  width: 20px;
  height: 40px;
`;

const Text = styled.p`
  color: #868b90;
  font-style: normal;
  font-weight: 500;
  line-height: 180%;
  font-size: 14px;

  @media (min-width: 1024px) {
    font-size: 16px;
  }

  display: ${(props) => (props.$isOpen ? "block" : "none")};
`;

const BtnsAfterLogin = () => {
  const { isOpen } = useMenuContext();
  const lang = i18n.language;

  const baseURL = `https://metarang.com/${lang}`;

  const menuItems = [
    {
      icon: HomeIcon,
      translationId: "149",
      link: baseURL,
    },
    {
      icon: NewsIcon,
      translationId: "255",
      link: "https://metatimes.ir/",
    },
    {
      icon: BlogIcon,
      translationId: "258",
      link: `${baseURL}/articles`,
    },
    {
      icon: TrainingIcon,
      translationId: "165",
      link: `${baseURL}/education`,
    },
    {
      icon: AboutIcon,
      translationId: "259",
      link: `${baseURL}/about`,
    },
    {
      icon: ContactIcon,
      translationId: "260",
      link: `${baseURL}/contact`,
    },
    {
      icon: RobotIcon,
      translationId: "574",
      link: `${baseURL}/version`,
    },
    {
      icon: CalendarIcon,
      translationId: "262",
      link: `${baseURL}/calendar`,
    },
    {
      icon: CitizenIcon,
      translationId: "263",
      link: `${baseURL}/citizens`,
    },
  ];

  return (
    <Container>
      {menuItems.map((item) => {
        const title = getTranslation(item.translationId);

        const button = (
          <Btn
            $isOpen={isOpen}
            href={item.link}
            target="_blank"
            rel="noreferrer"
          >
            <Icon src={item.icon} />
            <Text $isOpen={isOpen}>{title}</Text>
          </Btn>
        );

        return (
          <ToolTip
            disabled={isOpen} 
            key={item.translationId}
            TitleToltip={title}
            classNamePosstion=""
            Chidren={button}
          />
        );
      })}
    </Container>
  );
};

export default BtnsAfterLogin;