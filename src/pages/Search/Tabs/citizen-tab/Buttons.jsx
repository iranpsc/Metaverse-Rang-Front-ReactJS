import { useState } from "react";
import { BiCommentDots } from "react-icons/bi";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiUserUnfollowLine } from "react-icons/ri";
import { TiUserAddOutline } from "react-icons/ti";
import { useLocation, useNavigate } from "react-router";
import styled from "styled-components";
import ToolTip from "../../../../components/Tooltip/Tooltip";
import useRequest from "../../../../hooks/useRequest.js";
import { ToastError, getTranslation } from "../../../../services/Utility";

const DEFAULT_ERROR = "خطایی رخ داد، لطفاً دوباره تلاش کنید";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;

  @media (min-width: 768px) {
    gap: 18px;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: none;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.2 : 1)};

  svg {
    font-size: 17px;
    color: ${({ theme }) =>
      theme.colors.newColors.otherColors.buttonPrimaryText};
  }

  @media (min-width: 768px) {
    width: 36px;
    height: 36px;

    svg {
      font-size: 20px;
    }
  }
`;

const Buttons = ({ user }) => {
  const { Request } = useRequest();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [followOverride, setFollowOverride] = useState(null);

  const userId = user?.id;
  const isFollowed = followOverride ?? Boolean(user?.is_following);

  const handleFollowToggle = async () => {
    if (loading || !userId) return;

    const shouldFollow = !isFollowed;

    setLoading(true);

    try {
      await Request(`${shouldFollow ? "follow" : "unfollow"}/${userId}`);
      setFollowOverride(shouldFollow);
    } catch (error) {
      console.error("Follow API error:", error);
      ToastError(
        error?.response?.data?.error || error?.message || DEFAULT_ERROR,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleWriteMessage = () =>
    navigate("/documents/write", {
      state: { code: user?.code, user: userId, from: location.pathname },
    });

  const actions = [
    {
      key: "follow",
      icon: isFollowed ? <RiUserUnfollowLine /> : <TiUserAddOutline />,
      label: getTranslation("467"),
      onClick: handleFollowToggle,
      disabled: loading || !userId,
    },
    {
      key: "comment",
      icon: <BiCommentDots />,
      label: null,
      onClick: undefined,
      disabled: true,
    },
    {
      key: "message",
      icon: <MdOutlineMailOutline />,
      label: getTranslation("469"),
      onClick: handleWriteMessage,
      disabled: !userId,
    },
  ];

  return (
    <Container>
      {actions.map(({ key, icon, label, onClick, disabled }) => (
        <ToolTip
          width={"auto"}
          key={key}
          place="right"
          content={label}
          disabled={!label}
          Chidren={
            <IconButton type="button" disabled={disabled} onClick={onClick}>
              {icon}
            </IconButton>
          }
        />
      ))}
    </Container>
  );
};

export default Buttons;
