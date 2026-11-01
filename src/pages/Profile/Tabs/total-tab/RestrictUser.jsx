import styled, { css } from "styled-components";
import { useContext, useEffect, useState } from "react";
import {
  BiMessageDetail,
  BiMessageSquareDetail,
  BiVolumeMute,
} from "react-icons/bi";
import { FaCircle, FaEarDeaf } from "react-icons/fa6";
import { CiImageOn } from "react-icons/ci";
import { FiShare2 } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiUserForbidLine } from "react-icons/ri";

import useRequest from "../../../../hooks/useRequest.js";
import { UserContext } from "../../../../services/reducers/UserContext";
import { getTranslation } from "../../../../services/Utility";
import ToolTip from "../../../../components/Tooltip/Tooltip.jsx";

// آیتم‌های disabled فعلاً قابل تغییر نیستند و به بک‌اند ارسال نمی‌شوند
const ICONS = [
  { slug: "share", label: 734, icon: <FiShare2 /> },
  { slug: "follow", label: 733, icon: <RiUserForbidLine /> },
  { slug: "send_message", label: 469, icon: <BiMessageDetail /> },
  { slug: "view_profile_images", label: 732, icon: <CiImageOn /> },
  { slug: "view_features_locations", label: 731, icon: <FaEarDeaf /> },
  { slug: "email", label: 730, icon: <MdOutlineMailOutline />, disabled: true },
  { slug: "sound", label: 729, icon: <BiVolumeMute />, disabled: true },
  { slug: "send_ticket", label: 728, icon: <BiMessageSquareDetail /> },
  { slug: "record", label: 727, icon: <FaCircle />, disabled: true },
];

const OPTION_KEYS = ICONS.filter(({ disabled }) => !disabled).map(
  ({ slug }) => slug,
);

const INITIAL_OPTIONS = Object.fromEntries(
  ICONS.map(({ slug }) => [slug, false]),
);

const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const ACTIVE_BG = "#ff000029";
const ACTIVE_ICON = "#f44545ab";

const extractData = (response) => response?.data?.data ?? response?.data;

// فقط کلیدهای قابل ارسال را برمی‌گرداند و مقدارشان را به بولین تبدیل می‌کند
const pickOptions = (source = {}) =>
  Object.fromEntries(OPTION_KEYS.map((key) => [key, source[key] === true]));

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #454545;
  border-radius: 10px;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 0;
  }
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-size: 14px;
  font-weight: 600;

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const Icons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 13px;
`;

const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  background-color: ${({ $active, theme }) =>
    $active ? ACTIVE_BG : theme.colors.newColors.otherColors.menuBg};

  svg {
    font-size: 20px;
    color: ${({ $disabled, $active }) =>
      $disabled ? "#555" : $active ? ACTIVE_ICON : "#868B90"};
  }

  ${({ $disabled }) =>
    !$disabled &&
    css`
      &:hover {
        background-color: ${ACTIVE_BG};

        svg {
          color: ${ACTIVE_ICON};
        }
      }
    `}
`;

const RestrictUser = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const [user] = useContext(UserContext);

  const [limitationId, setLimitationId] = useState(null);
  const [options, setOptions] = useState(INITIAL_OPTIONS);

  const hasExistingLimitation = limitationId !== null;

  useEffect(() => {
    if (!user?.id) return;

    Request(
      `users/${user.id}/profile-limitations`,
      HTTP_METHOD.GET,
      {},
      JSON_HEADERS,
    )
      .then((response) => {
        const limitation = extractData(response);

        if (!limitation?.id) {
          setLimitationId(null);
          return;
        }

        setLimitationId(limitation.id);
        setOptions((prev) => ({ ...prev, ...pickOptions(limitation.options) }));
      })
      .catch((error) => {
        console.error("Error getting profile limitations:", error);
      });
  }, [user?.id]);

  const handleToggle = (slug) => {
    const previousOptions = options;
    const updatedOptions = {
      ...previousOptions,
      [slug]: !previousOptions[slug],
    };

    setOptions(updatedOptions);

    // ساخت اولیه: POST به‌همراه limited_user_id | ویرایش: PUT
    const payload = {
      options: pickOptions(updatedOptions),
      ...(hasExistingLimitation
        ? { _method: "put" }
        : { limited_user_id: user.id }),
    };

    Request(
      hasExistingLimitation
        ? `profile-limitations/${limitationId}`
        : "profile-limitations",
      hasExistingLimitation ? HTTP_METHOD.PUT : HTTP_METHOD.POST,
      payload,
      JSON_HEADERS,
    )
      .then((response) => {
        const limitation = extractData(response);

        if (!hasExistingLimitation && limitation?.id) {
          setLimitationId(limitation.id);
        }
      })
      .catch((error) => {
        console.error("Error updating restrictions:", error);
        setOptions(previousOptions);
      });
  };

  return (
    <Container>
      <Title>{getTranslation("726")}</Title>

      <Icons>
        {ICONS.map(({ slug, label, icon, disabled }) => (
          <ToolTip
            key={slug}
            width="auto"
            ContentToltip={disabled ? undefined : getTranslation(String(label))}
            lang={user?.lang || "fa"}
            place="top"
            disabled={disabled}
            Chidren={
              <IconWrapper
                $disabled={disabled}
                $active={!disabled && options[slug]}
                onClick={disabled ? undefined : () => handleToggle(slug)}
              >
                {icon}
              </IconWrapper>
            }
          />
        ))}
      </Icons>
    </Container>
  );
};

export default RestrictUser;
