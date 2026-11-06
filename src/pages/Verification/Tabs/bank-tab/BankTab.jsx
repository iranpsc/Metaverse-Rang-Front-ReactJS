// تب حساب‌های بانکی کاربر (نمایش کارت‌ها با لوگوی بانک، افزودن و حذف کارت)؛ کارت‌ها را یک بار از سرور می‌گیرد؛ مناسب صفحه‌ی احراز هویت بانکی

import styled from "styled-components";
import { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import AddBankCard from "./AddBankCard";
import Container from "../../../../components/Common/Container";
import TitleHeader from "../../../../components/TitleHeader";
import { BankCardSkeleton } from "../../../../components/Skeletons/BankCardSkeleton.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation, convertToPersian } from "../../../../services/Utility";
import ayande from "../../../../assets/images/bank-icon/bank-ayandeh.png";
import melat from "../../../../assets/images/bank-icon/bank-melat.png";
import mehr from "../../../../assets/images/bank-icon/Bank-Mehr-Iran.png";
import saderat from "../../../../assets/images/bank-icon/bank-saderat.png";
import Button from "../../../../components/Button";
import ModalXs from "../../../../components/Modal/ModalXs";
import TitleBody from "../../../../components/TitleBody.jsx";
// نام بانک (از بک‌اند) => لوگو؛ بانک ناشناخته لوگوی صادرات می‌گیرد
const BANK_LOGOS = {
  "بانک مهر ایران": mehr,
  "بانک آینده": ayande,
  "بانک ملت": melat,
};
const DEFAULT_LOGO = saderat;

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 30px;
`;

// قاب هم‌اندازه برای کارت، اسکلتون و دکمه‌ی افزودن
const CardSlot = styled.div`
  width: 250px;
  height: 190px;
  overflow: hidden;
  border-radius: 10px;

  @media (min-width: 840px) {
    width: 305px;
  }

  @media (min-width: 940px) {
    width: 380px;
  }
`;

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #0066ff;
`;
const Info = styled.p`
  margin: 20px 0;
  font-size: 16px;
  font-weight: 400;
  text-align: justify;
  color: ${({ theme }) => theme.colors.newColors.shades.title};

  @media (max-width: 1023px) {
    font-size: 12px;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;
const NumberArea = styled.div`
  flex: 2;

  h2 {
    margin-top: 20px;
    text-align: center;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const BankName = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 5px;
  margin: 10px 10px 0 0;

  img {
    width: 20px;
  }

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const ShabaArea = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  padding: 10px 40px;
  background-color: #1a1a18;
`;

const DeleteButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.newColors.shades.bg2};
  cursor: pointer;

  svg {
    font-size: 17px;
  }
`;

const AddTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 2px dashed #454545;
  border-radius: 10px;
  font-size: 46px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const BankTab = () => {
  const { Request, HTTP_METHOD } = useRequest();

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null); // کارتی که منتظر تأیید حذف است
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    let cancelled = false;

    Request("bank-accounts")
      .then((response) => {
        if (!cancelled) setCards(response.data.data ?? []);
      })
      .catch((error) => console.error("Error fetching bank accounts:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const closeDeleteModal = () => setCardToDelete(null);

  const handleConfirmDelete = () => {
    setIsDeleting(true);

    Request(`bank-accounts/${cardToDelete.id}`, HTTP_METHOD.DELETE)
      .then(() => {
        setCards((prev) => prev.filter(({ id }) => id !== cardToDelete.id));
        closeDeleteModal();
      })
      .catch((error) => console.error("Error deleting bank account:", error))
      .finally(() => setIsDeleting(false));
  };
  return (
    <Container>
      <TitleHeader title={getTranslation("888")} />

      <Cards>
        {loading ? (
          <CardSlot>
            <BankCardSkeleton />
          </CardSlot>
        ) : (
          cards.map((card) => (
            <CardSlot key={card.id}>
              <Card>
                <NumberArea>
                  <BankName>
                    <img
                      src={BANK_LOGOS[card.bank_name] ?? DEFAULT_LOGO}
                      alt=""
                    />
                    <TitleBody small title={card.bank_name} />
                  </BankName>
                  <h2>{convertToPersian(card.card_num)}</h2>
                </NumberArea>
                <ShabaArea>
                  <TitleBody color="white" title={getTranslation("889")} />
                  <TitleBody
                    color="white"
                    title={convertToPersian(card.shaba_num)}
                  />
                </ShabaArea>
                <DeleteButton
                  type="button"
                  aria-label={getTranslation("738")}
                  onClick={() => setCardToDelete(card)}
                >
                  <HiOutlineTrash />
                </DeleteButton>
              </Card>
            </CardSlot>
          ))
        )}

        <CardSlot>
          <AddTile onClick={loading ? undefined : () => setOpenAddModal(true)}>
            + <TitleBody big weight title={getTranslation("890")} />
          </AddTile>
        </CardSlot>
      </Cards>

      {cardToDelete && (
        <ModalXs
          global
          onlyExit
          title={896}
          handleExitClick={closeDeleteModal}
          onClose={closeDeleteModal}
        >
          <Info>
            {getTranslation("897")} {getTranslation("898")}
          </Info>

          <Buttons>
            <Button
              color="#FF0000"
              textColor="#FFFFFF"
              label={getTranslation("899")}
              onClick={handleConfirmDelete}
              disabled={isDeleting ? "pending" : false}
            />
            <Button
              grayTheme
              label={getTranslation("900")}
              onClick={closeDeleteModal}
            />
          </Buttons>
        </ModalXs>
      )}
      {openAddModal && (
        <AddBankCard
          setOpenAddModal={setOpenAddModal}
          setCards={setCards}
          cards={cards}
        />
      )}
    </Container>
  );
};

export default BankTab;
