// کارت اطلاعات پروفایل کاربر (نام، کد، تاریخ ثبت‌نام، آمار دنبال‌کنندگان و دکمه‌ی اشتراک‌گذاری)؛ مناسب بالای تب پروفایل
import { LuShare2 } from "react-icons/lu";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import ShareModal from "./ShareModal";
import { UserContext } from "../../../../services/reducers/UserContext";
import useRequest from "../../../../hooks/useRequest.js";
import {
  getTranslation,
  convertToPersian,
  ConvertJalali,
} from "../../../../services/Utility";
import Button from "../../../../components/Button.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
import UserCode from "../../../../components/Usercode.jsx";
import InfoSkeleton from "../../../../components/Skeletons/InfoSkeleton.jsx";
const BORDER_COLOR = "#454545";


const Container = styled.div`
  min-width: 0;
  padding: 15px;
  border-radius: 0 0 0 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 840px) {
    padding: 12px;
  }

  @media (min-width: 1024px) {
    padding: 20px;
  }

  @media (min-width: 1400px) {
    border-bottom-right-radius: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${BORDER_COLOR};
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const Follow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
`;

const Divider = styled.div`
  width: 1px;
  height: 55px;
  background-color: ${BORDER_COLOR};
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 30px 0 10px;
`;

const FollowStat = ({ count, label }) => (
  <Follow>
    <TitleBody weight title={convertToPersian(count)} />
    <TitleBody title={label} />
  </Follow>
);

const Info = () => {
  const [openShare, setOpenShare] = useState(false);
  const [currentUser] = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { Request } = useRequest();

  const profileId = currentUser?.id;

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);

    Request(`users/${profileId}/profile`)
      .then((response) => {
        if (!ignore) setUser(response.data.data);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [profileId, Request]);

  if (loading) return <InfoSkeleton />;

  return (
    <Container>
      <Header>
        <div>
          <TitleBody weight title={user?.name} />
          <UserCode code={user?.code} />
        </div>
        <TitleBody
          title={`${getTranslation("53")} ${ConvertJalali(user?.registered_at)}`}
        />
      </Header>

      <Content>
        <FollowStat
          count={user?.followers_count}
          label={getTranslation("38")}
        />
        <Divider />
        <FollowStat
          count={user?.following_count}
          label={getTranslation("55")}
        />
      </Content>

      <Actions>
        <Button
          icon={<LuShare2 />}
          label={getTranslation("734")}
          grayTheme
          grow
          onclick={() => setOpenShare(true)}
        />
      </Actions>

      {openShare && <ShareModal setOpenShare={setOpenShare} data={user} />}
    </Container>
  );
};

export default Info;
