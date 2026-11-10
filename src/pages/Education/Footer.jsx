import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import styled from "styled-components";
import { useState } from "react";
import useRequest from "../../hooks/useRequest.js";
import TitleBody from "../../components/TitleBody.jsx";
import UserCode from "../../components/UserCode.jsx";
import { getSize } from "../../styles/sizes";
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  div {
    display: flex;
    align-items: center;
    gap: 3px;
  }

  @media (min-width: 500px) {
    gap: 20px;

    div {
      gap: 5px;
    }
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #969696;
  border-top: 1px solid #2d2d2a;
  gap: 8px;
  @media (max-width: 499px) {
    flex-wrap: wrap;
  }

  svg {
    font-size: ${getSize("default", "base")};
  }
  span {
    font-size: ${getSize("default", "base")};
    font-weight: 500;
    padding-top: 2px;
    cursor: pointer;
  }

  @media (min-width: 500px) and (max-width: 999px) {
    svg,
    span {
      font-size: ${getSize("default", "tablet")};
    }
  }

  @media (min-width: 1280px) {
    svg,
    span {
      font-size: ${getSize("default", "desktop")};
    }
  }

  @media (max-width: 1400px) {
    display: flex;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
`;
const Footer = ({ data }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [reaction, setReaction] = useState(null); // "like" | "dislike" | null

  const react = async (type) => {
    if (reaction === type) return;
    await Request(`tutorials/${data.id}/interactions`, HTTP_METHOD.POST);
    setReaction(type);
  };

  const isLiked = reaction === "like";
  const isDisliked = reaction === "dislike";

  const actions = [
    { id: 1, icon: <FaRegComment />, value: 0 },
    {
      id: 2,
      icon: isLiked ? <BiSolidLike /> : <BiLike />,
      value: (data?.likes ?? 0) + (isLiked ? 1 : 0),
      onClick: () => react("like"),
    },
    {
      id: 3,
      icon: isDisliked ? <BiSolidDislike /> : <BiDislike />,
      value: (data?.dislikes ?? 0) + (isDisliked ? 1 : 0),
      onClick: () => react("dislike"),
    },
    { id: 4, icon: <IoEyeOutline />, value: data?.views },
  ];

  return (
    <Container>
      <Right>
        <UserCode code={data?.creator_code} />
        <span>
          <TfiWrite />
        </span>
      </Right>
      <Left>
        {actions.map(({ id, icon, value, onClick }) => (
          <div key={id}>
            <TitleBody title={value} />
            <span onClick={onClick}>{icon}</span>
          </div>
        ))}
      </Left>
    </Container>
  );
};

export default Footer;
