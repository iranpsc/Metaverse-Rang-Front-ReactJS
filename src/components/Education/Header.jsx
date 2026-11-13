// هدر مدال راهنما؛ عنوان را از پراپ یا از روی آدرس تبی که کاربر الان داخلش است می‌سازد و دکمه‌های بزرگ/کوچک‌کردن و بستن را نشان می‌دهد.
import { IoIosClose } from "react-icons/io";
import { TbMinimize, TbMaximize } from "react-icons/tb";
import styled from "styled-components";
import { useLocation } from "react-router";
import { ExitIcon } from "../Icons/IconsHeader";
import getModalHeaderFromPrevious from "../../services/TitleManager";
import { getTranslation } from "../../services/Utility";
const ICON_SIZE = "35px";

const Div = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};

  svg {
    transform: scale(0.7);
    cursor: pointer;
  }
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 998px) {
    display: ${({ $hidden }) => ($hidden ? "none" : "flex")};
  }
`;

const Text = styled.h2`
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-weight: 600;
  font-size: 16px;

  @media (min-width: 998px) {
    font-size: 20px;
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    color: ${({ theme }) => theme.colors.newColors.otherColors.iconText};
      width: ${ICON_SIZE};
    height: ${ICON_SIZE};
    z-index: 999;

    @media (min-width: 1024px) {
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
  const { pathname } = useLocation();
  const { title } = getModalHeaderFromPrevious(pathname);

  // اگه title عدد (کلید ترجمه) بود ترجمه‌ش کن، اگه نبود از روی آدرس تب فعلی بساز
  const displayTitle = titleProp
    ? typeof titleProp === "number"
      ? getTranslation(String(titleProp))
      : titleProp
    : title;
  const handleMinimizeClick = (e) => {
    e.stopPropagation();
    if (onToggleFullscreen) onToggleFullscreen();
    else setSize?.(true);
  };

  const showToggle = onToggleFullscreen || setSize;

  return (
    <HeaderWrapper $hidden={show}>
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

        <ExitIcon
          role="button"
          data-no-drag
          onClick={() => setOpenEducation?.(false)}
        >
          <IoIosClose />
        </ExitIcon>
      </Icons>
    </HeaderWrapper>
  );
};

export default Header;
