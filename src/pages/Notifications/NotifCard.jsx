import { IoNotificationsOutline } from "react-icons/io5";
import { TbTrash } from "react-icons/tb";
import { useContext } from "react";
import styled from "styled-components";
import useRequest from "../../hooks/useRequest.js";
import { SanitizeHTML } from "../../services/Utility";
import {
  UserContext
} from "../../services/reducers/UserContext";
import { UserContextTypes } from "../../services/actions/UserContextAction";
const Container = styled.div`
  padding: 20px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  p {
    color: #a0a0ab;
    font-size: 14px;
  }
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};
  svg {
    color: ${(props) => props.theme.colors.newColors.otherColors.iconText};
  }
`;

const NameAndDate = styled.div`
  h2 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 500;
  }
  h3 {
    font-size: 14px;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
  span {
    margin-right: 7px;
  }
`;

const TrashWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 0, 0, 0.17);
  border-radius: 100%;
  cursor: pointer;
  svg {
    color: #ff0000;
  }
`;

const NotifCard = ({ id, setNotifications, notifications, data }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [user, dispatch] = useContext(UserContext);
  const deleteClickHandler = () => {
    Request(`notifications/read/${id}`, HTTP_METHOD.POST).then(() => {
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
      );
      dispatch({
        type: UserContextTypes.UPDATE_FIELD,
        payload: {
          key: "unread_notifications_count",
          value: user.unread_notifications_count - 1,
        },
      });

    });
  };
  return (
    <Container>
      <Profile>
        <Info>
          <IconWrapper>
            <IoNotificationsOutline size={30} />
          </IconWrapper>
          <NameAndDate>
            <h2> {data.data["sender-name"]}</h2>
            <h3>
              {data.date} <span>{data.time}</span>{" "}
            </h3>
          </NameAndDate>
        </Info>
        <TrashWrapper onClick={deleteClickHandler}>
          <TbTrash size={20} />
        </TrashWrapper>
      </Profile>
      <p
        dangerouslySetInnerHTML={{
          __html: SanitizeHTML(data.data.message),
        }}
      ></p>{" "}
    </Container>
  );
};

export default NotifCard;
