import { IoIosClose } from "react-icons/io";
import { TbMinimize, TbMaximize } from "react-icons/tb";
import styled from "styled-components";
import { ExitIcon } from "../Icons/IconsHeader";
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import getModalHeaderFromPrevious from "../../services/TitleManager";
import { getTranslation } from "../../services/Utility";

const Div = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};
  svg {
    transform: scale(0.7);
    cursor: pointer;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 998px) {
    display: ${(props) => (props.show ? "none" : "flex")};
  }
`;

const Text = styled.h2`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-weight: 600;
  font-size: ${(props) => (props.long ? "14px" : "16px")};
  @media (min-width: 998px) {
    font-size: 20px;
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  svg {
    color: ${(props) => props.theme.colors.newColors.otherColors.iconText};
    width: 30px;
    height: 30px;
    z-index: 999;
    @media (min-width: 998px) {
      width: 40px;
      height: 40px;
    }
  }
`;

const Header = ({
  show,
  setOpenEducation,
  setSize,
  title: titleProp, // از FullModal میاد
  isFullscreen,
  onToggleFullscreen,
}) => {
  const location = useLocation();
  const [routeTitle, setRouteTitle] = useState("");

  useEffect(() => {
    // فقط وقتی title از بیرون نیومده، از روی route بگیر
    if (titleProp) return;
    const basePath = location.state?.from || location.pathname;
    const { title } = getModalHeaderFromPrevious(basePath);
    setRouteTitle(title);
  }, [location.pathname, location.state, titleProp]);

  // اگه title عدد (کلید ترجمه) بود ترجمه‌ش کن، وگرنه همون رو نشون بده
  const displayTitle = titleProp
    ? typeof titleProp === "number"
      ? getTranslation(String(titleProp))
      : titleProp
    : routeTitle;

  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    if (onToggleFullscreen) onToggleFullscreen();
    else setSize?.(true);
  };

  const handleCloseClick = () => setOpenEducation?.(false);

  const showToggle = onToggleFullscreen || setSize;

  return (
    <HeaderWrapper show={show}>
      <Text>{displayTitle}</Text>

      <Icons>
        {showToggle && (
          <Div
            role="button"
            data-no-drag
            onClick={handleMinimizeClick}
            aria-label={isFullscreen ? "exit fullscreen" : "fullscreen"}
          >
            {onToggleFullscreen && !isFullscreen ? (
              <TbMaximize style={{ color: "#949494" }} />
            ) : (
              <TbMinimize style={{ color: "#949494" }} />
            )}
          </Div>
        )}

        <ExitIcon role="button" data-no-drag onClick={handleCloseClick}>
          <IoIosClose />
        </ExitIcon>
      </Icons>
    </HeaderWrapper>
  );
};

export default Header;
