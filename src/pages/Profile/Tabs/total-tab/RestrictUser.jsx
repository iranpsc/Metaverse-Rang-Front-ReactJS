import {
  BiMessageDetail,
  BiMessageSquareDetail,
  BiVolumeMute,
} from "react-icons/bi";
import { FaCircle, FaEarDeaf } from "react-icons/fa6";
import { CiImageOn } from "react-icons/ci";
import { FiShare2 } from "react-icons/fi";
import { MdOutlineMailOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { RiUserForbidLine } from "react-icons/ri";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import useRequest from "../../../../services/Hooks/useRequest";
import { UserContext } from "../../../../services/reducers/UserContext";
import { getTranslation } from "../../../../services/Utility";

const icons = [
  {
    id: 1,
    slug: "share",
    label: 734,
    icon: <FiShare2 />,
  },
  {
    id: 2,
    slug: "follow",
    label: 733,
    icon: <RiUserForbidLine />,
  },
  {
    id: 3,
    slug: "send_message",
    label: 469,
    icon: <BiMessageDetail />,
  },
  {
    id: 4,
    slug: "view_profile_images",
    label: 732,
    icon: <CiImageOn />,
  },
  {
    id: 5,
    slug: "view_features_locations",
    label: 731,
    icon: <FaEarDeaf />,
  },
  {
    id: 6,
    slug: "email",
    label: 730,
    icon: <MdOutlineMailOutline />,
  },
  {
    id: 7,
    slug: "sound",
    label: 729,
    icon: <BiVolumeMute />,
  },
  {
    id: 8,
    slug: "send_ticket",
    label: 728,
    icon: <BiMessageSquareDetail />,
  },
  {
    id: 9,
    slug: "record",
    label: 727,
    icon: <FaCircle />,
  },
];

const JSON_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const Container = styled.div`
  border: 1px solid #454545;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 0;
  }
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-weight: 600;
  font-size: 14px;

  @media (min-width: 1024px) {
    font-size: 18px;
  }
`;

const Icons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 13px;
flex-wrap: wrap;
  svg {
    color: ${(props) => props.theme.colors.newColors.otherColors.iconText};
  }
`;
const IconWrapper = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${(props) =>
    props.isDisabled
      ? props.theme.colors.newColors.otherColors.menuBg
      : props.isActive
        ? "#ff000029"
        : props.theme.colors.newColors.otherColors.menuBg};

  svg {
    font-size: 20px;
    color: ${(props) =>
    props.isDisabled
      ? "#555"
      : props.isActive
        ? "#f44545ab"
        : "#868B90"};
  }

  cursor: ${(props) => (props.isDisabled ? "not-allowed" : "pointer")};

  opacity: ${(props) => (props.isDisabled ? 0.5 : 1)};

  &:hover {
    background-color: ${(props) =>
    props.isDisabled ? props.theme.colors.newColors.otherColors.menuBg : "#ff000029"};

    svg {
      color: ${(props) =>
    props.isDisabled ? "#555" : "#f44545ab"};
    }
  }
`;

const RestrictUser = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const [user] = useContext(UserContext);

  const [limitationId, setLimitationId] = useState(null);
  const [hasExistingLimitation, setHasExistingLimitation] = useState(false);

  const [options, setOptions] = useState({
    record: false,
    send_message: false,
    sound: false,
    email: false,
    view_features_locations: false,
    view_profile_images: false,
    send_ticket: false,
    follow: false,
    share: false,
  });

  useEffect(() => {
    const requestId = user?.id;

    if (!requestId) return;

    Request(
      `users/${requestId}/profile-limitations`,
      HTTP_METHOD.GET,
      {},
      JSON_HEADERS,
    )
      .then((response) => {
        const limitation = response?.data?.data ?? response?.data;

        if (!limitation?.id) {
          setHasExistingLimitation(false);
          setLimitationId(null);
          return;
        }

        setLimitationId(limitation.id);

        setOptions((prevOptions) => ({
          ...prevOptions,
          follow: limitation.options?.follow === true,
          send_message: limitation.options?.send_message === true,
          send_ticket: limitation.options?.send_ticket === true,
          share: limitation.options?.share === true,
          view_features_locations:
            limitation.options?.view_features_locations === true,
          view_profile_images: limitation.options?.view_profile_images === true,
        }));

        setHasExistingLimitation(true);
      })
      .catch((error) => {
        console.error("Error getting profile limitations:", error);
      });
  }, [user?.id]);

  const handleIconClick = (slug) => {
    const optionsToSend = [
      "follow",
      "send_message",
      "send_ticket",
      "share",
      "view_features_locations",
      "view_profile_images",
    ];

    if (!optionsToSend.includes(slug)) {
      return;
    }

    const updatedOptions = {
      ...options,
      [slug]: !options[slug],
    };

    setOptions(updatedOptions);

    const payload = {
      options: optionsToSend.reduce(
        (result, key) => {
          result[key] = updatedOptions[key];
          return result;
        },
        {},
      ),
      ...(hasExistingLimitation ? { _method: "put" } : {}),
    };

    Request(
      hasExistingLimitation
        ? `profile-limitations/${limitationId}`
        : "profile-limitations",
      HTTP_METHOD.PUT,
      payload,
      JSON_HEADERS,
    )
      .then((response) => {

        const limitation = response?.data?.data ?? response?.data;

        if (!hasExistingLimitation && limitation?.id) {
          setLimitationId(limitation.id);
          setHasExistingLimitation(true);
        }
      })
      .catch((error) => {
        console.error("Error updating restrictions:", error);

        setOptions(options);
      });
  };
  const disabledSlugs = ["record", "sound", "email"];
  return (
    <Container>
      <Title>{getTranslation("726")}</Title>

      <Icons>
        {icons.map((icon) => {
          const isDisabled = disabledSlugs.includes(icon.slug);

          return (
            <div key={icon.id}>
              <IconWrapper
                isDisabled={isDisabled}
                isActive={!isDisabled && options[icon.slug]}
                data-tooltip-id={icon.slug}
                onClick={() => {
                  if (isDisabled) return;

                  handleIconClick(icon.slug);
                }}
              >
                {icon.icon}
              </IconWrapper>

              <ReactTooltip
                id={icon.slug}
                place="top"
                content={
                  isDisabled
                    ? null
                    : getTranslation(icon.label)
                }
              />
            </div>
          );
        })}
      </Icons>
    </Container>
  );
};

export default RestrictUser;
