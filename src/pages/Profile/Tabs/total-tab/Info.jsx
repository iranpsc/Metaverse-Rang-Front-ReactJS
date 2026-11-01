import { LuShare2 } from "react-icons/lu";
import styled, { css } from "styled-components";
import { useContext, useEffect, useState } from "react";
import ShareModal from "./ShareModal";
import { UserContext } from "../../../../services/reducers/UserContext";
import useRequest from "../../../../hooks/useRequest.js";
import {
  getTranslation,
  metarangUrlCitizen,
  convertToPersian,
  ConvertJalali,
} from "../../../../services/Utility";
import { Skeleton } from "../../../../components/Skeleton";
import Button from "../../../../components/Button.jsx";

/* ---------- Styles ---------- */

const BORDER_COLOR = "#454545";

const titleColor = ({ theme }) => theme.colors.newColors.shades.title;
const breakWords = css`
  overflow-wrap: anywhere;
`;

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

const Heading = styled.h2`
  font-size: 20px;
  color: ${titleColor};
`;

const Title = styled(Heading)`
  font-weight: 600;
  ${breakWords}
`;

const Count = styled(Heading)`
  font-weight: 500;
`;

const Code = styled.a`
  color: #0066ff;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
  ${breakWords}
`;

const RegisteredAt = styled.span`
  color: ${titleColor};
  font-size: 13px;
  font-weight: 500;
  ${breakWords}
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

const FollowLabel = styled.span`
  color: ${titleColor};
  font-size: 12px;
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

/* ---------- Skeleton styles ---------- */

const SkeletonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonFollow = styled(Follow)`
  gap: 5px;
`;

/* ---------- Small components ---------- */

const FollowStat = ({ count, label }) => (
  <Follow>
    <Count>{convertToPersian(count)}</Count>
    <FollowLabel>{label}</FollowLabel>
  </Follow>
);

const FollowSkeleton = () => (
  <SkeletonFollow>
    <Skeleton width="40px" height="24px" radius="4px" />
    <Skeleton width="50px" height="12px" radius="4px" />
  </SkeletonFollow>
);

const InfoSkeleton = () => (
  <Container>
    <Header>
      <SkeletonGroup>
        <Skeleton width="120px" height="24px" radius="8px" />
        <Skeleton width="100px" height="16px" radius="4px" />
      </SkeletonGroup>
      <Skeleton width="100px" height="16px" radius="4px" />
    </Header>

    <Content>
      <FollowSkeleton />
      <Divider />
      <FollowSkeleton />
    </Content>

    <Actions>
      <Skeleton width="100%" height="40px" radius="8px" />
    </Actions>
  </Container>
);

/* ---------- Component ---------- */

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
          <Title>{user?.name}</Title>
          <Code
            href={metarangUrlCitizen(user?.code)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {user?.code}
          </Code>
        </div>
        <RegisteredAt>
          {getTranslation("53")} {ConvertJalali(user?.registered_at)}
        </RegisteredAt>
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
