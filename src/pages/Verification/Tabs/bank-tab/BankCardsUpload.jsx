import AddBankCard from "./AddBankCard";
import ConfirmCardDelete from "./ConfirmCardDelete";
import { HiOutlineTrash } from "react-icons/hi";
import melat from "../../../../assets/images/bank-icon/bank-melat.png";
import saderat from "../../../../assets/images/bank-icon/bank-saderat.png";
import mehr from "../../../../assets/images/bank-icon/Bank-Mehr-Iran.png";
import ayande from "../../../../assets/images/bank-icon/bank-ayandeh.png";

import styled from "styled-components";
import { useState } from "react";
import { getTranslation } from "../../../../services/Utility";
import useRequest from "../../../../hooks/useRequest.js";
import { Skeleton } from "../../../../components/Skeleton";

const Container = styled.div`
  display: flex;
  gap: 20px;
`;

const BankCard = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  justify-content: flex-start;
`;

const Image = styled.div`
  position: relative;
  background-color: #0066ff;
`;

const UploadWrapper = styled.div`
  width: 250px;
  height: 190px;
  overflow: hidden;
  border-radius: 10px;
  div {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  @media (min-width: 840px) {
    width: 305px;
    height: 190px;
  }
  @media (min-width: 940px) {
    width: 380px;
    height: 190px;
  }
`;

const DisplayCard = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardNumber = styled.div`
  background-color: #0066ff;
  flex-grow: 2;
  height: 70% !important;
  background: url("/src/assets/images/auth/Shapes.png") no-repeat;
  div {
    display: flex;
    align-items: start;
    gap: 5px;
    height: fit-content;
    margin-right: 10px;
    margin-top: 10px;
    & img {
      width: 20px;
    }
    span {
      font-size: 12px;
      color: ${(props) => props.theme.colors.newColors.shades.title};
    }
  }
  h2 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    text-align: center;
    margin-top: 20px;
  }
`;

const CardShaba = styled.div`
  display: flex;
  flex-grow: 1;
  background-color: #1a1a18;
  flex-direction: column;
  gap: 5px;
  height: 35% !important;
  padding: 10px 40px;
  span {
    font-size: 12px;
    color: #fdfdfd;
    font-weight: 600;
  }
  h3 {
    color: white;
    font-size: 14px;
    font-weight: 500;
  }
`;

const Upload = styled.div`
  height: 97% !important;
  width: 97% !important;
  border-radius: 10px;
  border: 2px dashed #454545;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 46px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  position: relative;
  flex-grow: 1;
  span {
    font-size: 16px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
`;

const IconWrapper = styled.div`
  width: 24px !important;
  height: 24px !important;
  border-radius: 100%;
  position: absolute;
  left: 10px;
  bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffc700;
  svg {
    font-size: 17px;
    cursor: pointer;
  }
`;

// اسکلتون برای کارت بانکی
const SkeletonCard = styled.div`
  width: 250px;
  height: 190px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 840px) {
    width: 305px;
    height: 190px;
  }
  @media (min-width: 940px) {
    width: 380px;
    height: 190px;
  }
`;

const BankCardsUpload = ({
  cards,
  setCards,
  openAddModal,
  setOpenAddModal,
  openDeleteModal,
  setOpenDeleteModal,
  isLoading,
}) => {
  const [deleteIndex, setDeleteIndex] = useState(null);
  const { Request, HTTP_METHOD } = useRequest();

  const handleDeleteCard = ({ index, id }) => {
    Request(`bank-accounts/${id}`, HTTP_METHOD.DELETE).then(() => {
      setDeleteIndex(index);
      setOpenDeleteModal(true);
    });
  };
  // اسکلتون لودینگ
  if (isLoading) {
    return (
      <Container>
        <BankCard>
          {Array.from({ length: 1 }).map((_, index) => (
            <SkeletonCard key={index}>
              <Skeleton width="100%" height="190px" radius="10px" />
            </SkeletonCard>
          ))}
          <UploadWrapper>
            <Upload>
              +<span> {getTranslation("890")}</span>
            </Upload>
          </UploadWrapper>
        </BankCard>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <BankCard>
          {cards?.map((card, i) => {
            const bank=card.bank_name=="بانک مهر ایران"?mehr:card.bank_name=="بانک آینده"?ayande:card.bank_name=="بانک ملت"?melat:saderat;

            return (
              <UploadWrapper key={i}>
                <Image>
                  <IconWrapper
                    onClick={() => handleDeleteCard({ index: i, id: card.id })}
                  >
                    <HiOutlineTrash />
                  </IconWrapper>
                  <DisplayCard>
                    <CardNumber>
                      <div>
                        <img width={60} src={bank} alt="bank-logo" />
                        <span>{card.bank_name}</span>
                      </div>
                      <h2>{card.card_num}</h2>
                    </CardNumber>
                    <CardShaba>
                      <span> {getTranslation("889")}</span>
                      <h3>{card.shaba_num}</h3>
                    </CardShaba>
                  </DisplayCard>
                </Image>
              </UploadWrapper>
            );
          })}

          <UploadWrapper>
            <Upload onClick={() => setOpenAddModal(true)}>
              +<span> {getTranslation("890")}</span>
            </Upload>
          </UploadWrapper>
        </BankCard>
      </Container>

      {deleteIndex !== null && openDeleteModal && (
        <ConfirmCardDelete
          setOpenDeleteModal={setOpenDeleteModal}
          setCards={setCards}
          deleteIndex={deleteIndex}
        />
      )}

      {openAddModal && (
        <AddBankCard setOpenAddModal={setOpenAddModal} setCards={setCards} />
      )}
    </>
  );
};

export default BankCardsUpload;
