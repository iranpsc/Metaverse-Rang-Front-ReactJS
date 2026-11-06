import { IoNotificationsOutline } from "react-icons/io5";
import { TbTrash } from "react-icons/tb";
import { useContext } from "react";
import styled from "styled-components";
import useRequest from "../../hooks/useRequest.js";
import { UserContext } from "../../services/reducers/UserContext";
import { UserContextTypes } from "../../services/actions/UserContextAction";
import {
  ConvertJalali,
  convertToPersian,
  getTranslation,
} from "../../services/Utility";
import TitleBody from "../../components/TitleBody.jsx";
import { scale } from "../../styles/sizes";

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  ${scale("padding", { base: "10px", tablet: "14px", laptop: "20px" })}
  border-radius: 5px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  @media (min-width: 500px) {
    gap: 12px;
  }
`;

const SenderInfo = styled.div`
  min-width: 0;

  & > :first-child {
    overflow-wrap: anywhere;
  }
`;

const DateTime = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 3px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  ${scale("width", { base: "40px", tablet: "50px", laptop: "60px" })}
  ${scale("height", { base: "40px", tablet: "50px", laptop: "60px" })}
  border-radius: 100%;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};
  svg {
    color: ${(props) => props.theme.colors.newColors.otherColors.iconText};
    ${scale("font-size", { base: "22px", tablet: "26px", laptop: "30px" })}
  }
`;

const TrashWrapper = styled.button`
  flex: 0 0 auto;
  ${scale("width", { base: "30px", tablet: "34px", laptop: "36px" })}
  ${scale("height", { base: "30px", tablet: "34px", laptop: "36px" })}
  padding: 0;
  border: none;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 0, 0, 0.17);
  cursor: pointer;
  svg {
    color: #ff0000;
    ${scale("font-size", { base: "17px", tablet: "19px", laptop: "20px" })}
  }
`;

const NotifCard = ({ id, setNotifications, notifications, data }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [user, dispatch] = useContext(UserContext);
  const deleteClickHandler = () => {
    Request(`notifications/read/${id}`, HTTP_METHOD.POST).then(() => {
      setNotifications(
        notifications.filter((notification) => notification.id !== id),
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
            <IoNotificationsOutline />
          </IconWrapper>
          <SenderInfo>
            <TitleBody title={data.data["sender-name"]} />
            <DateTime>
              <TitleBody small weight title={ConvertJalali(data.date)} />
              <TitleBody small weight title={convertToPersian(data.time)} />
            </DateTime>
          </SenderInfo>
        </Info>
        <TrashWrapper
          type="button"
          onClick={deleteClickHandler}
          aria-label={getTranslation("738")}
        >
          <TbTrash />
        </TrashWrapper>
      </Profile>
      <TitleBody small title={data.data.message} />
    </Container>
  );
};

export default NotifCard;
