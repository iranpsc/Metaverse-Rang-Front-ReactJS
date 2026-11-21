// دکمه‌ی خروج از حساب (قرمز، با تولتیپ در حالت بسته بودن منو)؛ مناسب پایین سایدبار یا هر جای دیگری که به خروج نیاز است

import styled from "styled-components";
import { getTranslation } from "../../services/Utility";
import { removeItem } from "../../services/Utility/LocalStorage";
import LogoutIcon from "../../assets/svg/logout.svg";
import { useMenuContext } from "../../services/reducers/MenuContext.jsx";
import useRequest from "../../hooks/useRequest.js";
import { getSize } from "../../styles/sizes";

const DANGER_COLOR = "#e03131";
const DANGER_FILTER =
  "brightness(0) saturate(100%) invert(27%) sepia(95%) saturate(5000%) hue-rotate(350deg) brightness(90%) contrast(95%)";

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $isOpen }) => ($isOpen ? "flex-start" : "center")};
  gap: 10px;
  width: 100%;
  height: 46px;
  padding: 0 10px;
  border: none;
  background-color: rgba(224, 49, 49, 0.12);
  border-radius: 10px;
  transition: 0.2s;

  &:hover {
    background-color: rgba(224, 49, 49, 0.3);
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 40px;
  filter: ${DANGER_FILTER};
`;

const Text = styled.p`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  color: ${DANGER_COLOR};
  font-style: normal;
  font-weight: 500;
  line-height: 180%;
  font-size: ${getSize("default", "base")};

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${getSize("default", "tablet")};
  }

  @media (min-width: 1024px) {
    font-size: ${getSize("default", "desktop")};
  }
`;

const TRANSLATION_ID = "230";

const LogoutButton = () => {
  const { isOpen } = useMenuContext();
  const { Request, HTTP_METHOD } = useRequest();

  const handleLogout = async () => {
    try {
      await Request("auth/logout", HTTP_METHOD.POST, {}, {}, "development");
      removeItem("user");
      window.location.reload();
    } catch (error) {
      console.error("logout error", error);
    }
  };

  return (
    <Btn $isOpen={isOpen} onClick={handleLogout}>
      <Icon src={LogoutIcon} alt="" />
      <Text $isOpen={isOpen}>{getTranslation(TRANSLATION_ID)}</Text>
    </Btn>
  );
};

export default LogoutButton;
