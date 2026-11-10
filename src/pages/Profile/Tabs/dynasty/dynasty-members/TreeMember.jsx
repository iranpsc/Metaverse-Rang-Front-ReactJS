import defulte from "../../../../../assets/images/avatars/defulte-profile.webp";
import styled from "styled-components";
import { getTranslation } from "../../../../../services/Utility";
import Message from "../../../../../assets/svg/message.svg?react";
import { useFollow } from "../../../../../services/reducers/FollowContext.jsx";
import UserCode from "../../../../../components/UserCode.jsx";
const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border-radius: 5px;
  box-sizing: border-box;
  flex: 0 0 104px;
  width: 104px;
  min-width: 0;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 10;
  position: relative;

  &:not(:first-child)::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    width: 8px;
    height: 2px;
    background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.menuBg};
  }

  h3 {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    min-height: 2.4em;
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
    overflow-wrap: anywhere;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    max-width: 100%;
    font-size: 12px;
    font-weight: 500;
    text-align: center;
    overflow-wrap: anywhere;
  }

  @media (min-width: 768px) {
    flex-basis: 140px;
    width: 140px;
    padding: 15px;
    gap: 15px;

    &:not(:first-child)::after {
      width: 10px;
    }

    h3 {
      font-size: 16px;
    }

    a {
      font-size: 14px;
    }
  }
`;

const Image = styled.div`
  position: relative;
  flex: 0 0 auto;
  img {
    display: block;
    width: 56px;
    height: 56px;
    object-fit: cover;
  }

  @media (min-width: 768px) {
    img {
      width: 80px;
      height: 80px;
    }
  }

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
  width: 11px;
  height: 11px;
  border-radius: 100%;
  background-color: ${(props) => (props.online ? "#18c08f" : "#808080")};
  position: absolute;
  bottom: 5px;
  right: 5px;
  border: 2px solid #1a1a18;

  @media (min-width: 768px) {
    width: 14px;
    height: 14px;
    bottom: 10px;
    right: 10px;
  }
`;

const Chat = styled(Message)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  fill: #635d5dff;

  @media (min-width: 768px) {
    width: 25px;
    height: 25px;
  }
`;
const TreeMember = ({ item }) => {
  const relationTypes = [
    { value: "father", label: 125 }, // پدر
    { value: "mother", label: 126 },
    { value: "sister", label: 127 },
    { value: "brother", label: 128 },
    { value: "spouse", label: 825 },
    { value: "offspring ", label: 129 },
  ];
  const { isOnline } = useFollow();

  const getRelationshipLabel = (relationship) => {
    const found = relationTypes.find((type) => type.value === relationship);
    return found ? getTranslation(found.label) : relationship;
  };
  return (
    <Container>
      <Image>
        <Status online={isOnline(item.id)} />
        <Chat width={28} height={28} alt="chat" />
        <img
          src={item.profile_photo || defulte}
          alt="member"
          width={80}
          height={80}
        />
      </Image>
      <h3>{getRelationshipLabel(item.relationship)}</h3>
      <UserCode code={item.code} />

    </Container>
  );
};

export default TreeMember;
