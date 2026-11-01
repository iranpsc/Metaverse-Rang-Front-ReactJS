import { useContext, useEffect, useState } from "react";
import { FiInbox } from "react-icons/fi";
import styled from "styled-components";
import ModalSm from "../../components/Modal/ModalSm";
import NotificationsSkeleton from "../../components/Skeletons/NotificationsSkeleton.jsx";
import useRequest from "../../hooks/useRequest.js";
import { UserContextTypes } from "../../services/actions/UserContextAction";
import { UserContext } from "../../services/reducers/UserContext";
import { getTranslation } from "../../services/Utility";
import NotifCard from "./NotifCard";
import TitleBody from "../../components/TitleBody.jsx";
const Container = styled.div`
  height: 77%;
`;

const ReadAllButton = styled.button`
  width: fit-content;
  margin: 10px 0;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  padding-bottom: 60px;
  padding-inline-end: 15px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const EmptyIcon = styled(FiInbox)`
  font-size: 60px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Notifications = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const [, dispatch] = useContext(UserContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchNotifications = async () => {
      try {
        const response = await Request("notifications");
        if (!cancelled) setNotifications(response.data.data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (!cancelled) setNotifications([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNotifications();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleReadAll = async () => {
    try {
      await Request("notifications/read/all", HTTP_METHOD.POST);

      setNotifications([]);
      dispatch({
        type: UserContextTypes.UPDATE_FIELD,
        payload: { key: "unread_notifications_count", value: 0 },
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const renderList = () => {
    if (loading) return <NotificationsSkeleton />;

    if (notifications.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon />
          <TitleBody title={getTranslation("865")} />
        </EmptyState>
      );
    }

    return notifications.map((notif) => (
      <NotifCard
        key={notif.id}
        id={notif.id}
        data={notif}
        setNotifications={setNotifications}
      />
    ));
  };

  return (
    <ModalSm title="238">
      <Container>
        <ReadAllButton type="button" onClick={handleReadAll}>
          {getTranslation("866")}
        </ReadAllButton>

        <List>{renderList()}</List>
      </Container>
    </ModalSm>
  );
};

export default Notifications;
