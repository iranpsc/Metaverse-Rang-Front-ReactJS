import styled from "styled-components";
import { useState } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import DefaultProfile from "../../../../assets/images/defulte-profile.png";
import { getTranslation,metarangUrlCitizen } from "../../../../services/Utility";
const Button = styled.div`
  font-size: 16px;
  white-space: nowrap;
  color: ${(props) =>
    !props.gray
      ? props.theme.colors.newColors.primaryText
      : props.theme.colors.newColors.otherColors.btnIconText};
  font-weight: 600;
  background-color: ${(props) =>
    !props.gray
      ? props.theme.colors.primary
      : props.theme.colors.newColors.otherColors.btnIconBg};
  border-radius: 10px;
  padding: 10px 22px;
  cursor: pointer;
`;
const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  &:hover img {
    box-shadow: 0px 10px 25px -5px #0066ff40;
    border: 2px solid #0066ff;
  }
  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 18px;
    font-weight: 500;
  }
  a {
    text-decoration: none;
    color: #0066ff;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
  }
  & img {
    border-radius: 100%;
    border: 2px solid transparent;
    transition: all 0.2s linear;
  }
`;
const Card = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 15px;
`;

const Image = styled.div`
  position: relative;
  & img {
    border-radius: 100%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s linear;
  }
  &:hover img {
    &:nth-of-type(2) {
      box-shadow: 0px 10px 25px -5px ${({ theme }) => theme.colors.primary};
      border: 2px solid ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Status = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 100%;
  background-color: ${(props) => (props.online ? "#18c08f" : "#808080")};
  position: absolute;
  bottom: 10px;
  right: 10px;
  border: 2px solid #1a1a18;
`;

const FollowingCard = ({ name, code, id, profile_photo, online }) => {
  const [follow, setFollow] = useState(true);
  const { Request } = useRequest();
  const unFollowHandler = () => {
    Request(`unfollow/${id}`).then(() => {
      setFollow(false);
    });
  };
  const onFollowHandler = () => {
    Request(`follow/${id}`).then(() => {
      setFollow(true);
    });
  };
  return (
    <Card>
      <Profile>
        <Image>
          <Status online={online} />
          <img
            src={profile_photo || DefaultProfile}
            alt="member"
            width={80}
            height={80}
            onError={(e) => {
              e.target.src = DefaultProfile;
            }}
          />
        </Image>{" "}
        <div>
          <h3>{name}</h3>
          <a href={metarangUrlCitizen(code)} target="_blank" rel="noreferrer">
            {code}
          </a>
        </div>
      </Profile>
      {follow ? (
        <Button gray onClick={unFollowHandler}>
          {getTranslation("55")}
        </Button>
      ) : (
        <Button onClick={onFollowHandler}>
          {" "}
          {getTranslation("733")}
        </Button>
      )}
    </Card>
  );
};

export default FollowingCard;
