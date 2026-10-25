import { TiUserAddOutline } from "react-icons/ti";
import DefaultProfile from "../../../../assets/images/defulte-profile.png";
import styled from "styled-components";
import { useState } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation, metarangUrlCitizen } from "../../../../services/Utility";

const Button = styled.div`
  font-size: 16px;
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
  padding: 7px 20px 6px 20px;
  cursor: pointer;
  @media (min-width: 1024px) {
    padding: 7px 20px 4px 20px;
  }
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

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 20px;
  @media (min-width: 1300px) {
    flex-direction: row;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.newColors.primaryText};
  border-radius: 7px;
  font-size: 16px;
  cursor: pointer;
  flex-grow: 1;
  padding: 8px 20px 3px 20px;
  svg {
    font-size: 18px;
    padding-top: 4px;
  }
  @media (min-width: 740px) {
    h3 {
      font-size: 14px;
    }
  }
  @media (min-width: 1024px) {
    padding: 5px 20px 4px 20px;
    h3 {
      font-size: 16px;
    }
    svg {
      font-size: 18px;
    }
  }
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

const Follower = ({
  id,
  followers,
  setFollowers,
  name,
  code,
  profile_photo,
  online,
  canFollow,
}) => {
  const [follow, setFollow] = useState(canFollow);
  const { Request } = useRequest();
  const deleteHandler = () => {
    Request(`remove/${id}`).then(() => {
      setFollowers(followers.filter((item) => item.id !== id));
    });
  };
  const unFollowHandler = () => {
    Request(`unfollow/${id}`).then(() => {
      setFollow(true);
    });
  };
  const onFollowHandler = () => {
    Request(`follow/${id}`).then(() => {
      setFollow(false);
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
      <Buttons>
        {follow ? (
          <Container onClick={onFollowHandler}>
            <span>
              <TiUserAddOutline />
            </span>
            <h3> {getTranslation("55")}</h3>
          </Container>
        ) : (
          <Button onClick={unFollowHandler} gray>
            {getTranslation("737")}
          </Button>
        )}
        <Button onClick={deleteHandler}>
          {getTranslation("738")}
        </Button>
      </Buttons>
    </Card>
  );
};

export default Follower;
