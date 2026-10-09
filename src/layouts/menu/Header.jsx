import styled from "styled-components";
import LogoIcon from "../../assets/images/metarang-newLogo.png";
import { getTranslation } from "../../services/Utility";
import { useMenuContext } from "../../services/reducers/MenuContext";
import ArowMenu from "../../assets/svg/arowMenu.svg?react";
import { LangContainer, LangButton, LangMenu } from "./LangSelector.styles";
import { useState, useEffect } from "react";
import useLanguage from "../../services/Hooks/useLanguage";
import DropdownLanguageModule from "../../components/DropDownLang/DropdownLanguageModule";
import ThemeMenuModule from "./ThemeMenuModule";
import { languagesMeta } from "../../i18n/i18n";
import { metarangUrl } from "../../services/Utility";
const Logo = styled.img`
padding-top: 2px;
  height: 42px;
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

const Title = styled.p`
  color: ${(props) => props.theme.colors.newColors.otherColors.headerMenu};
  font-size: 16px;
      padding-top: 2px;

  height: 25px;
  cursor: pointer;
  font-style: normal;
  font-weight: 700;
  line-height: 180%;
`;

const Details = styled.p`
  color: #939393;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 180%;
`;

const BtnOpenCloseMenu = styled.button`
  width: ${(p) =>
    p.$isOpen ? "17px" : "41px"}; 
      height: ${(p) =>
    p.$isOpen ? "17px" : "41px"}; 
      margin-top: ${(p) =>
    p.$isOpen ? "13px" : ""};
    border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(p) =>
    p.$isOpen ? "0px" : "13px"};
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

const ContainerMain = styled.div`
  display: flex;
  gap: 12px;
`;
const Icon = styled(ArowMenu)`
  stroke: ${(props) => props.theme.colors.newColors.otherColors.iconText};

  transform: ${({ $isOpen, $isPersian }) => {
    if ($isPersian) {
      return $isOpen ? "rotate(0deg)" : "rotate(180deg)";
    } else {
      return $isOpen ? "rotate(180deg)" : "rotate(0deg)";
    }
  }};

  transition: transform 0.3s ease;


`;

const Header = () => {
  const { currentLang, changeLanguage, isPersian } = useLanguage();
  const [langArray, setLangArray] = useState([]);
  const [currentLangObject, setCurrentLangObject] = useState(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { isOpen, toggleMenu } = useMenuContext();

  useEffect(() => {
    setLangArray(languagesMeta);
    const found = languagesMeta.find((item) => item.code === currentLang);
    setCurrentLangObject(found || languagesMeta[0]);
  }, [currentLang]);
  return (
    <Container $isOpen={isOpen}>
      <ContainerMain>
        <Logo
          onClick={() => {
            window.open(metarangUrl(), "_blank");
          }}
          src={LogoIcon}
        />
        <ContainerText $isOpen={isOpen}>
          <Title
            onClick={() => {
              window.open(metarangUrl(), "_blank");
            }}
          >
            {getTranslation(148)}
          </Title>
          <Details>{getTranslation(905)}</Details>
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
      <BtnOpenCloseMenu onClick={toggleMenu} $isOpen={isOpen}>
        <Icon $isOpen={isOpen} $isPersian={isPersian} />
      </BtnOpenCloseMenu>
    </Container>
  );
};

export default Header;
