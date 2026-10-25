import { CiEdit } from "react-icons/ci";
import { EditContext } from "./NoteDetails";
import { GoTrash } from "react-icons/go";

import circle from "../../../../assets/images/link-circle.png";
import insta from "../../../../assets/images/instagram.png";
import send from "../../../../assets/images/send-2.png";
import styled from "styled-components";
import { useContext } from "react";
import whatsapp from "../../../../assets/images/whatsapp.png";
import Title from "../../../../components/Title";
import useRequest from "../../../../hooks/useRequest.js";
import { GlobalNoteStateContext } from "../GlobalNoteStateProvider";
import { getTranslation } from "../../../../services/Utility";

const Button = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.garyBtn};
  border-radius: 10px;
  display: flex;
  white-space: nowrap;
  padding: 10px 22px;
  gap: 6px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.newColors.otherColors.grayBtnText};
  svg {
    margin-top: 2px;
  }

  @media (max-width: 998px) {
    font-size: 12px;
    padding: 10px 15px;
  }
`;

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.newColors.shades.inputBg};
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #454545;
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin-top: 20px;
  gap: 10px;
`;
const Socials = styled.div`
  padding-right: 20px;
  border-right: 1px solid #454545;
  h3 {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
  div {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
`;
const Texts = styled.div`
  p {
    margin: 10px 0;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
    span {
      font-weight: 600;
      color: ${(props) => props.theme.colors.newColors.shades.title};
    }
  }
`;

const Label = styled.h3`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 14px;
  white-space: nowrap;
  font-weight: 600;
  margin-bottom: 4px;

  @media (max-width: 998px) {
    font-size: 12px;
  }
`;

const Subject = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
`;
const Status = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 400;
    color: ${(props) => props.theme.colors.newColors.shades.title};

    @media (max-width: 998px) {
      font-size: 14px;
    }
  }
`;
const Date = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 400;
    color: ${(props) => props.theme.colors.newColors.shades.title};

    @media (max-width: 998px) {
      font-size: 14px;
    }
  }
`;
const socials = [
  { id: 1, icon: circle },
  { id: 2, icon: whatsapp },
  { id: 3, icon: insta },
  { id: 4, icon: send },
];
const NoteCard = ({ data }) => {
  const { setIsEditing } = useContext(EditContext);
  const { dispatch } = useContext(GlobalNoteStateContext);
  const { Request } = useRequest();
  const removeNoteHandler = async () => {
    try {
      await Request(`notes/${data.id}`, "DELETE");
      dispatch({ type: "REMOVE_NOTE", payload: data.id });
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };
  return (
    <Container>
      <Info>
        <Texts>
          <Title title={data?.title} />
          <p>#{data?.id}</p>
        </Texts>
        <Socials>
          <h3>{getTranslation("1367")}</h3>
          <div>
            {socials.map((item) => (
              <img
                width={24}
                height={24}
                key={item.id}
                src={item.icon}
                alt="icon"
              />
            ))}
          </div>
        </Socials>
      </Info>
      <Content>
        <Subject>
          <Label>{getTranslation("1370")}</Label>
          <h2>{data?.name}</h2>
        </Subject>
        <Status status={data?.status}>
          <Label>{getTranslation("1369")}</Label>
          <h2>{data?.date}</h2>
        </Status>
        <Date>
          <Label>{getTranslation("1368")}</Label>
          <h2>{data?.date}</h2>
        </Date>
        <div
          style={{
            marginRight: "auto",
            display: "flex",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <Button onClick={removeNoteHandler}>
            <GoTrash size={22} />
            <h4>{getTranslation("738")}</h4>
          </Button>
          <Button onClick={() => setIsEditing(true)}>
            <CiEdit size={22} />
            <h4>{getTranslation("460")}</h4>
          </Button>
        </div>
      </Content>
    </Container>
  );
};

export default NoteCard;
