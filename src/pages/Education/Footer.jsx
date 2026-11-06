import { BiDislike, BiLike } from "react-icons/bi";

import { FaRegComment } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import { ToastError } from "../../services/Utility/index.jsx";
import styled from "styled-components";
import { useState } from "react";
import useRequest from "../../hooks/useRequest.js";
import TitleBody from "../../components/TitleBody.jsx";
import UserCode from "../../components/Usercode.jsx";
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
  padding-top: 5px;
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
    display: ${(props) => (props.show ? "none" : "flex")};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
`;

const Footer = ({ show, data }) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(data?.likes);
  const [dislikeCount, setDislikeCount] = useState(data?.dislikes);

  const handleLike = async () => {
    if (!isLiked) {
      try {
        await Request(`tutorials/like/${data.id}`, HTTP_METHOD.POST);
        setLikeCount(likeCount + 1);
        setIsLiked(true);
        setIsDisliked(false);
      } catch {
        ToastError("خطا در ارسال درخواست به سرور برای لایک:");
      }
    }
  };

  const handleDislike = async () => {
    if (!isDisliked) {
      try {
        await Request(`tutorials/dislike/${data.id}`, HTTP_METHOD.POST);
        setDislikeCount(dislikeCount + 1);
        setIsLiked(false);
        setIsDisliked(true);
      } catch {
        ToastError("خطا در ارسال درخواست به سرور برای دیسلایک:");
      }
    }
  };
  const actions = [
    { id: 1, icon: <FaRegComment />, value: "0" },
    {
      id: 2,
      icon: <BiLike />,
      value: likeCount,
      onClick: () => {
        handleLike();
      },
    },
    {
      id: 3,
      icon: <BiDislike />,
      value: dislikeCount,
      onClick: () => {
        handleDislike();
      },
    },
    { id: 4, icon: <IoEyeOutline />, value: data?.views },
  ];
  return (
    <Container show={show}>
      <Right>
        <UserCode code={data?.creator_code} />

        <span>
          <TfiWrite />
        </span>
      </Right>
      <Left>
        {actions.map((item) => (
          <div key={item.id}>
            <TitleBody title={item.value} />

            <span onClick={item.onClick}>{item.icon}</span>
          </div>
        ))}
      </Left>
    </Container>
  );
};

export default Footer;
