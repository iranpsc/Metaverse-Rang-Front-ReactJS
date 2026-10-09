import { BiCommentDots } from "react-icons/bi";
import { MdOutlineMailOutline } from "react-icons/md";
import { TiUserAddOutline } from "react-icons/ti";
import { RiUserUnfollowLine } from "react-icons/ri";
import styled from "styled-components";
import { useEffect, useState } from "react";
import useRequest from "../../../../services/Hooks/useRequest";
import { useNavigate, useLocation } from "react-router";
import { getTranslation, ToastError } from "../../../../services/Utility";
import ToolTip from "../../../../components/Tooltip";
const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  background-color: ${(props) => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.2 : 1)};

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
  const [loading, setLoading] = useState(false);
  const [isFollowed, setIsFollowed] = useState(
    Boolean(user?.is_following)
  );

  const { Request } = useRequest();
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    setIsFollowed(Boolean(user?.is_following));
  }, [user?.is_following]);

  const handleFollowToggle = async () => {
    const id = user?.id;

    if (loading || !id) return;

    const shouldFollow = !isFollowed;



    setLoading(true);

    try {
      await Request(
        `${shouldFollow ? "follow" : "unfollow"}/${id}`
      );

      setIsFollowed(shouldFollow);
    } catch (err) {
      console.error("Follow API error:", err);
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      id: 1,
      icon: isFollowed ? <RiUserUnfollowLine /> : <TiUserAddOutline />,
      label: getTranslation("467"),
      onClick: handleFollowToggle,
      disabled: loading || !user?.id,
    },
    {
      id: 2,
      icon: <BiCommentDots />,
      label: null,
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
          <ToolTip
            place="right"
            content={item.label}
            disabled={!item.label}
            Chidren={
              <IconWrapper $disabled={item.disabled}>{item.icon}</IconWrapper>
            }
          />
        </div>
      ))}
    </Container>
  );
};

export default Buttons;