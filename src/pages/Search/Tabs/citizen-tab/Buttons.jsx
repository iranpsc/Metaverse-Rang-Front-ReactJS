import { BiCommentDots } from "react-icons/bi";
import { MdOutlineMailOutline } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TiUserAddOutline } from "react-icons/ti";
import { RiUserUnfollowLine } from "react-icons/ri";
import styled from "styled-components";
import { useContext, useState } from "react";
import { FollowContext } from "../../../../services/reducers/FollowContext";
import useRequest from "../../../../services/Hooks/useRequest";
import { useNavigate, useLocation } from "react-router";
import _ from "lodash";
import { getTranslation, ToastError } from "../../../../services/Utility";

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};
  svg {
    font-size: 20px;
    color: ${(props) =>
    props.theme.colors.newColors.otherColors.buttonPrimaryText};
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 18px;
`;

const showError = (err) => {
  const message =
    err?.response?.data?.error ||
    err?.message ||
    "خطایی رخ داد، لطفاً دوباره تلاش کنید";
  ToastError(message);
};

const Buttons = ({ user }) => {
  const [follow, dispatch] = useContext(FollowContext);
  const [loading, setLoading] = useState(false);
  const { Request } = useRequest();
  const navigate = useNavigate();
  const location = useLocation();

  // دریافت دوباره لیست فالوینگ‌ها
  const refreshFollowing = async () => {
    const response = await Request("following");
    dispatch(response.data.data);
  };

  const handleFollowToggle = async (id, shouldFollow) => {
    if (loading || !id) return;
    setLoading(true);

    try {
      await Request(`${shouldFollow ? "follow" : "unfollow"}/${id}`);
    } catch (err) {
      showError(err);
      setLoading(false);
      return;
    }

    try {
      await refreshFollowing();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const isFollowed =
    _.findIndex(follow, (o) => parseInt(o.id) === parseInt(user?.id)) > -1;

  const items = [
    {
      id: 1,
      icon: isFollowed ? <RiUserUnfollowLine /> : <TiUserAddOutline />,
      label: getTranslation("467"),
      onClick: () => handleFollowToggle(user?.id, !isFollowed),
      disabled: loading || !user?.id,
    },
    {
      id: 2,
      icon: <BiCommentDots />,
      label: null, // getTranslation("468")
      onClick: null,
      disabled: true,
    },
    {
      id: 3,
      icon: <MdOutlineMailOutline />,
      label: getTranslation("469"),
      onClick: () =>
        navigate("/documents/write", {
          state: {
            code: user?.code,
            user: user?.id,
            from: location.pathname,
          },
        }),
      disabled: !user?.id,
    },
  ];

  return (
    <Container>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={item.disabled ? undefined : item.onClick}
        >
          <IconWrapper disabled={item.disabled} data-tooltip-id={item.label}>
            {item.icon}
          </IconWrapper>
          <ReactTooltip
            style={{ backgroundColor: "#434343", borderRadius: "10px" }}
            place="right"
            id={item.label}
            content={item.label}
          />
        </div>
      ))}
    </Container>
  );
};

export default Buttons;