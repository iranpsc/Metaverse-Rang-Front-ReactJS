import { useContext, useState } from "react";

import EditInput from "../enter-tab/EditInput";
import { MdAccessTime } from "react-icons/md";
import { ParticipantsContext } from "./ParticipationTab";

import styled from "styled-components";
import TitleValue from "../../../../components/TitleValue";

const BackGround = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.713);
`;
const Modal = styled.div`
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  padding: 20px;
  width: 100%;
  max-width: 515px;
  max-height: 363px;
`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  @media (max-width: 1023px) {
    font-size: 18px;
  }
`;
const Info = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-weight: 400;
  text-align: justify;
  margin: 20px 0;
  font-size: 16px;
  @media (max-width: 1023px) {
    font-size: 12px;
  }
`;
const Inputs = styled.div`
  display: grid;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  margin: 25px 0;
  &:first-child {
    width: 100%;
  }
`;
const Button = styled.div`
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primary};
  border: none;
  height: 45px;
  width: fit-content;
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.newColors.primaryText};
  font-family: inherit;
  @media (min-width: 998px) {
    height: 50px;
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font-size: 16px;
    color: red;
    cursor: pointer;
  }
`;

const EditConfirmModal = ({ id, setEdit }) => {
  const { participantsList, setParticipantsList } =
    useContext(ParticipantsContext);
  let editedItem = participantsList.find((item) => item.id === id);
  const [edited, setEdited] = useState("");
  const editHandler = () => {
    const updatedEditedItem = { ...editedItem, satisfyCount: edited };
    setParticipantsList((prev) => [
      ...prev.filter((item) => item.id !== id),
      updatedEditedItem,
    ]);
    setEdit(false);
  };
  return (
    <BackGround>
      <Modal>
        <div>
          <Div>
            <Title>ویرایش تعداد رضایت</Title>
            <span onClick={() => setEdit(false)}>X</span>
          </Div>
          <Info>با تغییر مقدار رضایت در زمان ساخت ملک تاثیر خواهید گزاشت </Info>
        </div>
        <Inputs>
          <EditInput
            type="number"
            title="تعداد رضایت"
            value={edited}
            onchange={(e) => setEdited(e.target.value)}
            step={0.0001}
          />
          <TitleValue
            icon={<MdAccessTime />}
            title="زمان کسر شده"
            value="۳۴ روز | ۱۸ ساعت ۲۹ دقیقه ۴۵ ثانیه"
          />
        </Inputs>
        <Button onClick={editHandler}>ویرایش تعداد رضایت</Button>
      </Modal>
    </BackGround>
  );
};

export default EditConfirmModal;
