// Top header of the side menu: logo, title/subtitle, language and theme buttons and the open/close toggle, all in one horizontal row.
import styled from "styled-components";
import LogoIcon from "../../assets/images/brand/metarang-newLogo.webp";
import { useMenuContext } from "../../services/reducers/MenuContext.jsx";
import ArowMenu from "../../assets/svg/arowMenu.svg?react";
import { LangContainer, LangButton, LangMenu } from "./LangSelector.styles";
import { useState, useEffect } from "react";
import useLanguage from "../../hooks/useLanguage.js";
import DropdownLanguageModule from "../../components/DropDownLang/DropdownLanguageModule";
import ThemeMenuModule from "./ThemeMenuModule";
import { getLanguagesMeta, subscribeLanguagesMeta } from "../../i18n/i18n";
import { metarangUrl, getTranslation } from "../../services/Utility";
import TitleBody from "../../components/TitleBody.jsx";
import MarqueeText from "../../components/MarqueeText";

const GAP = "5px";
const TEXT_MAX_WIDTH_MOBILE = 70;
const TEXT_MAX_WIDTH_DESKTOP = 100;
const DESKTOP_BREAKPOINT = 1024;

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(
    () => window.innerWidth >= DESKTOP_BREAKPOINT,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
};

const Logo = styled.img`
  height: 42px;
  width: 42px;
  flex-shrink: 0;
  cursor: pointer;
  @media (max-width: 1024px) {
    height: 35px;
    width: 35px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: ${(props) => (props.$isOpen ? "space-between" : "center")};
  gap: ${GAP};
  width: 100%;
  position: relative;
`;

const Headerbtn = styled.div`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
`;

const ContainerText = styled.div`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: start;
  justify-content: center;
  min-width: 0;
`;

const BtnOpenCloseMenu = styled.button`
  flex-shrink: 0;
  width: ${(p) => (p.$isOpen ? "17px" : "41px")};
  height: ${(p) => (p.$isOpen ? "17px" : "41px")};
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => (p.$isOpen ? "0px" : "13px")};
  background-color: ${(p) =>
    p.$isOpen ? "transparent" : p.theme.colors.newColors.otherColors.themeBtn};
  position: ${(p) => (p.$isOpen ? "relative" : "absolute")};
  ${(p) => {
    const direction = document.body.dir || "ltr";
    return direction === "ltr"
      ? `right: ${!p.$isOpen ? "-75px" : "0"};`
      : `left: ${!p.$isOpen ? "-75px" : "0"};`;
  }}
  z-index: 9;
  border: none;
`;

const Icon = styled(ArowMenu)`
  stroke: ${(props) => props.theme.colors.newColors.otherColors.iconText};
  width: 17px;
  height: 17px;
  transform: ${({ $isOpen, $isPersian }) => {
    if ($isPersian) {
      return $isOpen ? "rotate(0deg)" : "rotate(180deg)";
    }
    return $isOpen ? "rotate(180deg)" : "rotate(0deg)";
  }};
  transition: transform 0.3s ease;
`;

const Header = () => {
  const { currentLang, changeLanguage, isRtl } = useLanguage();
  const [langArray, setLangArray] = useState(getLanguagesMeta);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { isOpen, toggleMenu } = useMenuContext();
  const isDesktop = useIsDesktop();
  const textMaxWidth = isDesktop
    ? TEXT_MAX_WIDTH_DESKTOP
    : TEXT_MAX_WIDTH_MOBILE;
  const currentLangObject =
    langArray.find((item) => item.code === currentLang) || langArray[0];

  useEffect(() => {
    return subscribeLanguagesMeta(() => setLangArray(getLanguagesMeta()));
  }, []);

  return (
    <Container $isOpen={isOpen}>
      <Logo
        onClick={() => window.open(metarangUrl(), "_blank")}
        src={LogoIcon}
        alt="متارنگ"
      />

      <ContainerText $isOpen={isOpen}>
        <MarqueeText maxWidth={textMaxWidth}>
          <TitleBody
            lineHeight={1.5}
            noMargin
            weight={600}
            noWrap
            title={getTranslation(148)}
          />
        </MarqueeText>
        <MarqueeText maxWidth={textMaxWidth}>
          <TitleBody
            lineHeight={1.1}
            noMargin
            small
            mutedText
            noWrap
            title={getTranslation(905)}
          />
        </MarqueeText>
      </ContainerText>

      <Headerbtn $isOpen={isOpen}>
        <LangContainer isOpen={isOpen}>
          <LangButton onClick={() => setIsLangOpen(!isLangOpen)}>
            <img
              src={currentLangObject?.icon}
              alt={currentLangObject?.native_name}
              width={28}
              height={28}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </LangButton>

          {isLangOpen && (
            <LangMenu>
              <DropdownLanguageModule
                langArray={langArray}
                currentLangObject={currentLangObject}
                changeLanguage={changeLanguage}
                currentLang={currentLang}
                setIsLangOpen={setIsLangOpen}
                isLangOpen={isLangOpen}
              />
            </LangMenu>
          )}
        </LangContainer>
        <ThemeMenuModule />
      </Headerbtn>

      <BtnOpenCloseMenu
        onClick={toggleMenu}
        $isOpen={isOpen}
        aria-label={isOpen ? "open menu" : "close menu"}
        aria-expanded={isOpen}
      >
        <Icon $isOpen={isOpen} $isPersian={isRtl} aria-hidden="true" />
      </BtnOpenCloseMenu>
    </Container>
  );
};

export default Header;
