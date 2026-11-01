import {
  getBankNameFromCardNumber,
  getShebaInfo,
  verifyCardNumber,
} from "@persian-tools/persian-tools";
import { useState } from "react";
import styled from "styled-components";
import Button from "../../../../components/Button";
import ModalXs from "../../../../components/Modal/ModalXs";
import useRequest from "../../../../hooks/useRequest.js";
import {
  ToastSuccess,
  convertToEnglish,
  getTranslation,
} from "../../../../services/Utility";
import LabeledInput from "../../../../components/LabeledInput.jsx";
const SHEBA_PREFIX = "IR";
const SHEBA_LENGTH = 24;
const CARD_LENGTH = 16;

const MESSAGES = {
  invalidSheba: "شماره شبا صحیح نمی باشد لطفا آنرا بررسی نمایید.",
  bankMismatch: "شماره شبا و شماره کارت باید متعلق به یک کارت باشد.",
  invalidCard: "شماره کارت صحیح نمی باشد لطفا آنرا بررسی نمایید.",
  duplicateCard: "شما قبلا این کارت را ثبت کرده‌اید.",
  success:
    "حساب بانکی شما با موفقیت ثبت شد. تایید نهایی پس از بررسی های لازم صورت میگیرد",
  requestFailed: "خطایی در ثبت حساب بانکی رخ داد.",
};

const Inputs = styled.div`
  display: grid;
  gap: 20px;
  width: 100%;
  margin: 30px 0;
`;

const ErrorMessage = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  color: #df2e38;
`;

// فقط ارقام و بدون فاصله، برای مقایسه‌ی دقیق شماره کارت
const normalize = (value) => convertToEnglish(value ?? "").replace(/\D/g, "");

const isDuplicate = (cards, card_num) =>
  cards.some((card) => normalize(card.card_num) === normalize(card_num));

// اگر اطلاعات درست بود شبا و نام بانک، وگرنه پیام خطا و فیلد مربوطه را برمی‌گرداند
const validate = ({ card_num, shaba_num }, cards) => {
  // چک تکراری بودن مستقل از شبا، به‌محض کامل شدن شماره کارت
  if (card_num.length === CARD_LENGTH && isDuplicate(cards, card_num)) {
    return { error: MESSAGES.duplicateCard, field: "duplicate" };
  }

  const sheba = `${SHEBA_PREFIX}${shaba_num}`;
  const shebaInfo = getShebaInfo(sheba);

  if (shaba_num.length !== SHEBA_LENGTH || !shebaInfo?.persianName) {
    return { error: MESSAGES.invalidSheba, field: "shaba_num" };
  }

  if (card_num.length !== CARD_LENGTH) {
    return { error: MESSAGES.invalidCard, field: "card_num" };
  }

  if (getBankNameFromCardNumber(card_num) !== shebaInfo.persianName) {
    return { error: MESSAGES.bankMismatch, field: "card_num" };
  }

  if (!verifyCardNumber(card_num)) {
    return { error: MESSAGES.invalidCard, field: "card_num" };
  }

  return { sheba, bankName: shebaInfo.persianName };
};

// خطا فقط وقتی نمایش داده می‌شود که فیلد مربوطه به طول کامل رسیده باشد
const shouldShowError = ({ field }, { card_num, shaba_num }) => {
  // تکراری بودن فقط به کامل بودن شماره کارت وابسته است
  if (field === "duplicate") return true;
  if (field === "shaba_num") return shaba_num.length === SHEBA_LENGTH;
  if (field === "card_num") {
    return shaba_num.length === SHEBA_LENGTH && card_num.length === CARD_LENGTH;
  }
  return false;
};

const AddBankCard = ({ cards = [], setOpenAddModal, setCards }) => {
  const { Request, HTTP_METHOD } = useRequest();

  const [cardInfo, setCardInfo] = useState({ card_num: "", shaba_num: "" });
  const [loading, setLoading] = useState(false);

  const validation = validate(cardInfo, cards);
  const isValid = !validation.error;
  const showError = !isValid && shouldShowError(validation, cardInfo);

  const closeModal = () => setOpenAddModal(false);

  const handleChange = (field) => (event) =>
    setCardInfo((prev) => ({ ...prev, [field]: event.target.value }));

  const addCard = async () => {
    if (loading || !isValid) return;

    setLoading(true);

    await Request("bank-accounts", HTTP_METHOD.POST, {
      card_num: cardInfo.card_num,
      shaba_num: validation.sheba,
      bank_name: validation.bankName,
    });

    ToastSuccess(MESSAGES.success);
    closeModal();

    const response = await Request("bank-accounts");
    setCards(response.data.data);
    setLoading(false);
  };

  return (
    <ModalXs
      global
      onlyExit
      title={890}
      onClose={closeModal}
      handleExitClick={closeModal}
    >
      <Inputs>
        <LabeledInput
          placeholder={getTranslation("636")}
          type="number"
          maxLength={CARD_LENGTH}
          value={cardInfo.card_num}
          onChange={handleChange("card_num")}
        />
        <LabeledInput
          placeholder={getTranslation("889")}
          type="number"
          maxLength={SHEBA_LENGTH}
          value={cardInfo.shaba_num}
          onChange={handleChange("shaba_num")}
        />
      </Inputs>

      {showError && <ErrorMessage>{validation.error}</ErrorMessage>}

      <Button
        label={getTranslation("890")}
        onClick={addCard}
        disabled={loading ? "pending" : !isValid}
      />
    </ModalXs>
  );
};

export default AddBankCard;
