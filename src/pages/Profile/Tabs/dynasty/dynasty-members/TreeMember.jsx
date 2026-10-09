import defulte from "../../../../../assets/images/defulte-profile.png";
import styled from "styled-components";
import { getTranslation } from "../../../../../services/Utility";
import Message from "../../../../../assets/svg/message.svg?react";
import { metarangUrlCitizen } from "../../../../../services/Utility";
import { useFollow } from "../../../../../services/reducers/FollowContext";
const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 10;
  width: 140px;
  position: relative;

  @media (max-width: 768px) {
    flex: 0 1 calc(50% - 6px);
    width: auto;
    max-width: 140px;
    min-width: 0;
    padding: 12px 8px;
    gap: 10px;

    &:not(:first-child)::after {
      display: none;
    }

    h3 {
      font-size: 14px;
      text-align: center;
    }

    a {
      font-size: 12px;
      overflow-wrap: anywhere;
      text-align: center;
    }
  }

  &:not(:first-child)::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 100%;
    width: 10px;
    height: 2px;
    background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.menuBg};
  }

  h3 {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 600;
  }
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 14px;
    font-weight: 500;
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

const Chat = styled(Message)`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 25px;
  height: 25px;
  fill: #635d5dff;
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
      <a href={metarangUrlCitizen(item.code)} target="_blank" rel="noreferrer">
        {item.code}
      </a>
    </Container>
  );
};

export default TreeMember;
