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

const Logo = styled.img`
  padding-top: 2px;
  height: 42px;
  width: 42px;
  cursor: pointer;
`;

const Container = styled.div`
  display: flex;
  align-items: start;
  justify-content: ${(props) => (props.$isOpen ? "space-between" : "center")};
  gap: 5px;
  width: 100%;
  position: relative;
`;

const Headerbtn = styled.div`
  flex-direction: row;
  padding-top: 5px;
  gap: 10px;
  display: ${(props) => (props.$isOpen ? "flex" : "none")};

  @media (max-width: 767px) {
    padding-top: 8px;
  }
`;

const ContainerText = styled.div`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  align-items: start;
  white-space: nowrap;
  justify-content: center;
  flex-direction: column;

  @media (max-width: 767px) {
    padding-top: 2px;
  }
`;

const BtnOpenCloseMenu = styled.button`
  width: ${(p) => (p.$isOpen ? "17px" : "41px")};
  height: ${(p) => (p.$isOpen ? "17px" : "41px")};
  margin-top: ${(p) => (p.$isOpen ? "13px" : "")};
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) => (p.$isOpen ? "0px" : "13px")};
  background-color: ${(p) =>
    p.$isOpen ? "transparent" : p.theme.colors.newColors.otherColors.themeBtn};

  position: ${(props) => (props.$isOpen ? "relative" : "absolute")};
  ${(props) => {
    const direction = document.body.dir || "ltr";
    return direction === "ltr"
      ? `right: ${!props.$isOpen ? "-75px" : "0"}`
      : `left: ${!props.$isOpen ? "-75px" : "0"}`;
  }};
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
    } else {
      return $isOpen ? "rotate(180deg)" : "rotate(0deg)";
    }
  }};

  transition: transform 0.3s ease;
`;
const ContainerMain = styled.div`
  display: flex;
  gap: 12px;
`;

const Header = () => {
  const { currentLang, changeLanguage, isRtl } = useLanguage();
  const [langArray, setLangArray] = useState(getLanguagesMeta);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { isOpen, toggleMenu } = useMenuContext();
  const currentLangObject =
    langArray.find((item) => item.code === currentLang) || langArray[0];

  useEffect(() => {
    return subscribeLanguagesMeta(() => setLangArray(getLanguagesMeta()));
  }, []);
  return (
    <Container $isOpen={isOpen}>
      <ContainerMain>
        <Logo
          onClick={() => {
            window.open(metarangUrl(), "_blank");
          }}
          src={LogoIcon}
          alt="متارنگ"
        />
        <ContainerText $isOpen={isOpen}>
          <TitleBody
            noMargin
            weight
            noWrap
            title={getTranslation(148)}
            onClick={() => {
              window.open(metarangUrl(), "_blank");
            }}
          />

          <TitleBody noMargin small gray noWrap title={getTranslation(905)} />
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
      </ContainerMain>
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
