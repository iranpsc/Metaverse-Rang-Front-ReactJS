import { useState } from "react";
import { TiUserAddOutline } from "react-icons/ti";
import styled from "styled-components";
import Button from "../../../../components/Button.jsx";
import UserCode from "../../../../components/Usercode.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import DefaultProfile from "../../../../assets/images/defulte-profile.png";
import { getTranslation } from "../../../../services/Utility/index.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
const Card = styled.article`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 15px;
  }
`;

const Profile = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 10px;

  @media (min-width: 600px) {
    gap: 16px;
  }
`;

const Image = styled.div`
  position: relative;
  flex: 0 0 44px;
  width: 44px;
  height: 44px;

  img {
    width: 100%;
    height: 100%;
    border: 2px solid transparent;
    border-radius: 50%;
    object-fit: cover;
    transition: all 0.2s linear;
  }

  &:hover img {
    box-shadow: 0 10px 25px -5px #0066ff40;
    border-color: #0066ff;
  }

  @media (min-width: 600px) {
    flex-basis: 72px;
    width: 72px;
    height: 72px;
  }

  @media (min-width: 1000px) {
    flex-basis: 80px;
    width: 80px;
    height: 80px;
  }
`;

const Status = styled.span`
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 1;
  width: 9px;
  height: 9px;
  border: 2px solid ${({ theme }) => theme.colors.newColors.otherColors.inputBg};
  border-radius: 50%;
  background-color: ${({ $online }) => ($online ? "#18c08f" : "#808080")};

  @media (min-width: 600px) {
    right: 4px;
    bottom: 4px;
    width: 13px;
    height: 13px;
  }
`;

const Identity = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;

  > button {
    flex: 1 1 auto;
  }

  @media (min-width: 700px) {
    width: auto;
    flex-wrap: nowrap;
    gap: 10px;

    > button {
      flex: 0 0 auto;
    }
  }
  @media (max-width: 670px) {
    flex-direction: column;

    > button {
      align-self: flex-end;
      flex-direction: column;
    }
  }
`;

const FollowButton = styled(Button)`
  min-width: 0;
  height: 38px;
  padding: 6px 12px;

  @media (min-width: 600px) {
    height: 42px;
    padding: 8px 16px;
  }
`;

const MemberCard = ({
  mode,
  id,
  setFollowers,
  name,
  code,
  profile_photo,
  online,
  canFollow = false,
}) => {
  const [isFollowing, setIsFollowing] = useState(
    mode === "following" || !canFollow,
  );
  const [pendingAction, setPendingAction] = useState(null);
  const { Request } = useRequest();

  const handleFollowChange = async () => {
    if (pendingAction) return;

    const shouldFollow = !isFollowing;
    setPendingAction("follow");
    try {
      await Request(`${shouldFollow ? "follow" : "unfollow"}/${id}`);
      setIsFollowing(shouldFollow);
    } catch (error) {
      console.error("Error updating follow status:", error);
    } finally {
      setPendingAction(null);
    }
  };

  const handleRemoveFollower = async () => {
    if (pendingAction) return;

    setPendingAction("remove");
    try {
      await Request(`remove/${id}`);
      setFollowers?.((current) =>
        current.filter((follower) => follower.id !== id),
      );
    } catch (error) {
      console.error("Error removing follower:", error);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <Card>
      <Profile>
        <Image>
          <Status $online={online} />
          <img
            src={profile_photo || DefaultProfile}
            alt=""
            onError={(event) => {
              event.currentTarget.src = DefaultProfile;
            }}
          />
        </Image>
        <Identity>
          <TitleBody title={name} />
          <UserCode code={code} size="small" />
        </Identity>
      </Profile>

      <Actions>
        {mode === "follower" && !isFollowing && (
          <FollowButton
            icon={<TiUserAddOutline />}
            label={getTranslation("55")}
            size="small"
            disabled={pendingAction ? "pending" : false}
            onClick={handleFollowChange}
          />
        )}
        {mode === "follower" && isFollowing && (
          <FollowButton
            grayTheme
            label={getTranslation("737")}
            size="small"
            disabled={pendingAction ? "pending" : false}
            onClick={handleFollowChange}
          />
        )}
        {mode === "following" && (
          <FollowButton
            grayTheme={isFollowing}
            label={getTranslation(isFollowing ? "55" : "733")}
            size="small"
            disabled={pendingAction ? "pending" : false}
            onClick={handleFollowChange}
          />
        )}
        {mode === "follower" && (
          <FollowButton
            label={getTranslation("738")}
            size="small"
            disabled={pendingAction ? "pending" : false}
            onClick={handleRemoveFollower}
          />
        )}
      </Actions>
    </Card>
  );
};

export default MemberCard;
