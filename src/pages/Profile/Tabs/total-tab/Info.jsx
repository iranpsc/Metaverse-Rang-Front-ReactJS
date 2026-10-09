import { BiCommentDots } from "react-icons/bi";
import { LuShare2 } from "react-icons/lu";
import ShareModal from "./ShareModal";
import { TiUserAddOutline } from "react-icons/ti";
import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import ButtonIcon from "../../../../components/ButtonIcon";
import { UserContext } from "../../../../services/reducers/UserContext";
import useRequest from "../../../../services/Hooks/useRequest";
import {
  getTranslation,
  metarangUrlCitizen,
} from "../../../../services/Utility";
import { useParams } from "react-router";
import { convertToPersian, ConvertJalali } from "../../../../services/Utility";
import { Skeleton } from "../../../../components/Skeleton";

const Container = styled.div`
  min-width: 0;
  padding: 15px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-bottom-left-radius: 10px;
  @media (min-width: 840px) {
    padding: 12px;
  }
  @media (min-width: 1024px) {
    padding: 20px;
  }
  @media (min-width: 1400px) {
    padding: 20px;
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
  border-bottom: 1px solid #454545;
  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 13px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }
`;

const Title = styled.h2`
  overflow-wrap: anywhere;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 20px;
  font-weight: 600;
`;

const Code = styled.a`
  overflow-wrap: anywhere;
  color: #0066ff;
  font-weight: 500;
  text-decoration: none;
  text-transform: uppercase;
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
  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 12px;
  }
`;

const Count = styled.h2`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 20px;
  font-weight: 500;
`;

const Buttons = styled.div``;

const Upper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 30px 0 10px 0;
`;

const Info = () => {
  const [openShare, setOpenShare] = useState(false);
  const [userId] = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { Request } = useRequest();
  useEffect(() => {
    const requestId = id || userId?.id;
    if (requestId) {
      setLoading(true);
      Request(`users/${requestId}/profile`)
        .then((response) => {
          setUser(response.data.data);
        })
        .catch((error) => {
          console.error("Error loading user profile:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, userId?.id]);

  if (loading) {
    return (
      <Container>
        <Header>
          <div>
            <Skeleton
              width="120px"
              height="24px"
              radius="8px"
              style={{ marginBottom: "8px" }}
            />
            <Skeleton width="100px" height="16px" radius="4px" />
          </div>
          <Skeleton width="100px" height="16px" radius="4px" />
        </Header>
        <Content>
          <Follow>
            <Skeleton width="40px" height="24px" radius="4px" />
            <Skeleton
              width="50px"
              height="12px"
              radius="4px"
              style={{ marginTop: "5px" }}
            />
          </Follow>
          <div
            style={{ height: "55px", width: "1px", backgroundColor: "#454545" }}
          />
          <Follow>
            <Skeleton width="40px" height="24px" radius="4px" />
            <Skeleton
              width="50px"
              height="12px"
              radius="4px"
              style={{ marginTop: "5px" }}
            />
          </Follow>
        </Content>
        <Buttons>
          <Upper>
            {id && <Skeleton width="100%" height="40px" radius="8px" />}
            <Skeleton width="100%" height="40px" radius="8px" />
          </Upper>
          {id && (
            <Skeleton
              width="100%"
              height="40px"
              radius="8px"
              style={{ marginTop: "10px" }}
            />
          )}
        </Buttons>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>{user?.name}</Title>
          <Code href={metarangUrlCitizen(user?.code)} target="_blank">
            {user?.code}
          </Code>
        </div>
        <span>
          {getTranslation("53")} {ConvertJalali(user?.registered_at)}
        </span>
      </Header>
      <Content>
        <Follow>
          <Count>{convertToPersian(user?.followers_count)}</Count>
          <span>{getTranslation("38")}</span>
        </Follow>
        <div
          style={{ height: "55px", width: "1px", backgroundColor: "#454545" }}
        />
        <Follow>
          <Count>{convertToPersian(user?.following_count)}</Count>
          <span>{getTranslation("55")}</span>
        </Follow>
      </Content>
      <Buttons>
        <Upper>
          {id && (
            <ButtonIcon
              grow
              icon={<TiUserAddOutline />}
              label="دنبال کردن"
              fill
              onclick={() => { }}
            />
          )}
          <ButtonIcon
            grow
            icon={<LuShare2 />}
            label={getTranslation("734")}
            onclick={() => setOpenShare(true)}
          />
        </Upper>
        {id && (
          <ButtonIcon
            grow
            icon={<BiCommentDots />}
            label="پیام دادن"
            onclick={() => { }}
          />
        )}
      </Buttons>
      {openShare && <ShareModal setOpenShare={setOpenShare} data={user} />}
    </Container>
  );
};

export default Info;
