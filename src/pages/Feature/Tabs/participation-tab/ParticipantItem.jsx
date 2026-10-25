import { useState } from "react";
import styled from "styled-components";
import { AiTwotoneEdit } from "react-icons/ai";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineUser } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";

import satisfyIcon from "../../../../assets/images/satisfy.png";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditConfirmModal from "./EditConfirmModal";
import TitleValue from "../../../Store/shop/TitleValue";
import {
  convertToPersian,
  getTranslation,
  metarangUrlCitizen,
} from "../../../../services/Utility";

const USER_CODE = "HM-2000081";

const Card = styled.div`
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Row = styled.div`
  display: flex;
`;

const Summary = styled.div`
  flex-grow: 1;
  display: grid;
  grid-template-columns: 2fr 2fr 2fr;
  align-items: center;
  gap: 10px;

  @media (min-width: 1000px) {
    grid-template-columns: 1fr 1.5fr 1fr 1.2fr 1.2fr 1.2fr;
    gap: 50px;
  }
`;

const CodeBox = styled.div`
  a {
    font-size: 12px;
    color: #0066ff;
    text-decoration: none;
  }

  @media (min-width: 998px) {
    a {
      font-size: 16px;
    }
  }
`;

const CodeLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
  color: #a0a0ab;

  span {
    font-size: 12px;
  }

  @media (min-width: 998px) {
    span {
      font-size: 14px;
    }
  }
`;

const SatisfyBox = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  @media (min-width: 998px) {
    font-size: 16px;
  }
`;

const SatisfyTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h3 {
    font-size: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  @media (min-width: 998px) {
    h3 {
      font-size: 14px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  @media (min-width: 1500px) {
    flex-direction: row;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 100%;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.otherColors.iconText};
  background-color: ${({ $active, theme }) =>
    $active
      ? theme.colors.primary
      : theme.colors.newColors.otherColors.iconBg};
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

const OptionItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Satisfy = ({ count }) => (
  <SatisfyBox>
    <SatisfyTitle>
      <h3>{getTranslation("567")}</h3>
      <img src={satisfyIcon} alt="pricing" width={18} height={18} />
    </SatisfyTitle>
    <span>{convertToPersian(count)}</span>
  </SatisfyBox>
);

// کامپوننت یک ردیف شرکت‌کننده برای نمایش کد کاربر (لینک به پروفایل)، زمان، بدهی، سطح و رضایت او.
// مناسب لیست شرکت‌کنندگان است؛ دکمه‌های حذف و ویرایش مودال تأیید باز می‌کنند و دکمه فلش، لیست گزینه‌های ثبت‌شده را باز و بسته می‌کند.
const ParticipantItem = ({ id, time, debt, level, satisfyCount, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
      <Card>
        <Row>
          <Summary>
            <CodeBox>
              <CodeLabel>
                <HiOutlineUser size={20} />
                <span>{getTranslation("563")}</span>
              </CodeLabel>
              <a
                href={metarangUrlCitizen(USER_CODE)}
                target="_blank"
                rel="noreferrer"
              >
                {USER_CODE}
              </a>
            </CodeBox>

            <TitleValue title={getTranslation("564")} value={time} />
            <TitleValue title={getTranslation("565")} value={debt} />
            <TitleValue title={getTranslation("566")} value={level} />
            <Satisfy count={satisfyCount} />
          </Summary>

          <Actions>
            <ActionButton type="button" onClick={() => setIsDeleting(true)}>
              <FiTrash2 />
            </ActionButton>
            <ActionButton type="button" onClick={() => setIsEditing(true)}>
              <AiTwotoneEdit />
            </ActionButton>
            <ActionButton
              type="button"
              $active={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <IoIosArrowDown
                style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
              />
            </ActionButton>
          </Actions>
        </Row>

        {isOpen && (
          <OptionsList>
            {options.map((option) => (
              <OptionItem key={option.id}>
                <TitleValue
                  title={getTranslation("571")}
                  value={option.submit}
                />
                <Satisfy count={satisfyCount} />
              </OptionItem>
            ))}
          </OptionsList>
        )}
      </Card>

      {isEditing && <EditConfirmModal id={id} setEdit={setIsEditing} />}
      {isDeleting && (
        <DeleteConfirmModal id={id} setDeleteParticipant={setIsDeleting} />
      )}
    </>
  );
};

export default ParticipantItem;