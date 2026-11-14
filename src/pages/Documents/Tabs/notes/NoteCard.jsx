import { CiEdit } from "react-icons/ci";
import { GoTrash } from "react-icons/go";
import styled from "styled-components";

import circle from "../../../../assets/images/social/link-circle.png";
import insta from "../../../../assets/images/social/instagram.png";
import send from "../../../../assets/images/social/send-2.png";
import whatsapp from "../../../../assets/images/social/whatsapp.png";
import TitleHeader from "../../../../components/TitleHeader";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";

const SOCIALS = [
  { id: 1, icon: circle },
  { id: 2, icon: whatsapp },
  { id: 3, icon: insta },
  { id: 4, icon: send },
];

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

const Texts = styled.div`
  p {
    margin: 10px 0;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
  }
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

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 20px;
  gap: 10px;
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

// مقدار هر فیلد اطلاعات (نام، وضعیت، تاریخ)؛ $strong برای فیلد عنوان/نام با وزن بیشتر و بدون کوچک شدن در موبایل
const Value = styled.h2`
  font-size: 16px;
  font-weight: ${({ $strong }) => ($strong ? 500 : 400)};
  color: ${(props) => props.theme.colors.newColors.shades.title};

  @media (max-width: 998px) {
    font-size: ${({ $strong }) => ($strong ? "16px" : "14px")};
  }
`;

const Actions = styled.div`
  margin-right: auto;
  display: flex;
  gap: 20px;
  align-items: start;
`;

const ActionButton = styled.button`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.garyBtn};
  color: ${(props) => props.theme.colors.newColors.otherColors.grayBtnText};
  border: none;
  border-radius: 10px;
  display: flex;
  white-space: nowrap;
  padding: 10px 22px;
  gap: 6px;
  cursor: pointer;
  font: inherit;

  svg {
    margin-top: 2px;
  }

  @media (max-width: 998px) {
    font-size: 12px;
    padding: 10px 15px;
  }
`;

// این کامپوننت برای کارت اطلاعات یک یادداشت (عنوان، شماره، شبکه‌های اجتماعی، نام، وضعیت، تاریخ و دکمه‌های حذف و ویرایش) در جزئیات یادداشت استفاده میشه
const NoteCard = ({ data, onNoteDeleted, setShowDetails, setIsEditing }) => {
  const { Request, HTTP_METHOD } = useRequest();

  const handleDelete = async () => {
    await Request(`notes/${data.id}`, HTTP_METHOD.DELETE);
    onNoteDeleted(data.id);
    setShowDetails(false);
  };

  return (
    <Container>
      <Info>
        <Texts>
          <TitleHeader title={data?.title} />
          <p>#{data?.id}</p>
        </Texts>

        <Socials>
          <h3>{getTranslation("1367")}</h3>
          <div>
            {SOCIALS.map(({ id, icon }) => (
              <img key={id} src={icon} width={24} height={24} alt="" />
            ))}
          </div>
        </Socials>
      </Info>

      <Content>
        <div>
          <Label>{getTranslation("1370")}</Label>
          <Value $strong>{data?.name}</Value>
        </div>

        <div>
          <Label>{getTranslation("1369")}</Label>
          <Value>{data?.date}</Value>
        </div>

        <div>
          <Label>{getTranslation("1368")}</Label>
          <Value>{data?.date}</Value>
        </div>

        <Actions>
          <ActionButton type="button" onClick={handleDelete}>
            <GoTrash size={22} />
            <span>{getTranslation("738")}</span>
          </ActionButton>
          <ActionButton type="button" onClick={() => setIsEditing(true)}>
            <CiEdit size={22} />
            <span>{getTranslation("460")}</span>
          </ActionButton>
        </Actions>
      </Content>
    </Container>
  );
};

export default NoteCard;
