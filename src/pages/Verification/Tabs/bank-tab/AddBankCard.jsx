import styled from "styled-components";
import { useState } from "react";
import { ExitIcon } from "../../../../components/Icons/IconsHeader";
import EditInput from "../../../Feature/Tabs/enter-tab/EditInput";
import useRequest from "../../../../hooks/useRequest.js";
import {
  getBankNameFromCardNumber,
  getShebaInfo,
  verifyCardNumber,
} from "@persian-tools/persian-tools";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
} from "../../../../services/Utility";

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
  background-color: ${(props) => props.theme.colors.newColors.shades.bg2};
  padding: 20px;
  width: 100%;
  max-width: 515px;
  max-height: 363px;
  display: flex;
  gap: 30px;
  flex-direction: column;
  position: relative;
`;
const Header = styled.div`
  display: flex;
  gap: 10px;
`;
const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  @media (max-width: 1023px) {
    font-size: 18px;
  }
`;

const Inputs = styled.div`
  width: 100%;
  display: grid;
  gap: 20px;
`;

const Button = styled.button`
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.newColors.primaryText};
  border: none;
  padding: 0 14px;
  width: fit-content;
  height: 45px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  font-family: inherit;
`;

const ErrorMessage = styled.div`
  color: #df2e38;
  font-size: 14px;
  margin-top: 10px;
`;

const AddBankCard = ({ setOpenAddModal, setCards }) => {
  const [cardInfo, setCardInfo] = useState({
    card_num: "",
    shaba_num: "",
  });
  const [errors, setErrors] = useState([]);
  const { Request, HTTP_METHOD } = useRequest();

  const addCard = () => {
    setErrors([]);
    const shebaInfo = getShebaInfo(`IR${cardInfo.shaba_num}`);
    const cardValidate = verifyCardNumber(cardInfo.card_num);
    const cardName = getBankNameFromCardNumber(cardInfo.card_num);

    if (shebaInfo?.persianName) {
      if (cardName === shebaInfo.persianName) {
        if (cardValidate) {
          Request("bank-accounts", HTTP_METHOD.POST, {
            card_num: cardInfo.card_num,
            shaba_num: `IR${cardInfo.shaba_num}`,
            bank_name: shebaInfo.persianName,
          })
            .then(() => {
              ToastSuccess(
                "حساب بانکی شما با موفقیت ثبت شد. تایید نهایی پس از بررسی های لازم صورت میگیرد/ قابلیت بارگذاری ٢٠ حساب بانکی توسط متقاضی صورت گیرد",
              );
              setOpenAddModal(false);
              // Refresh the cards list
              Request("bank-accounts").then((response) => {
                setCards(response.data.data);
              });
            })
            .catch((error) => {
              ToastError(
                error?.response?.data?.message ||
                  "خطایی در ثبت حساب بانکی رخ داد.",
              );
            });
        } else {
          setErrors(["شماره کارت صحیح نمی باشد لطفا آنرا بررسی نمایید."]);
        }
      } else {
        setErrors(["شماره شبا و شماره کارت باید متعلق به یک کارت باشد."]);
      }
    } else {
      setErrors(["شماره شبا صحیح نمی باشد لطفا آنرا بررسی نمایید."]);
    }
  };

  return (
    <BackGround>
      <Modal>
        {" "}
        <Header>
          <ExitIcon onClick={() => setOpenAddModal(false)}></ExitIcon>
          <Title>{getTranslation("890")}</Title>
        </Header>
        <Inputs>
          <EditInput
            title={getTranslation("636")}
            type="number"
            maxLength={16}
            value={cardInfo.card_num}
            onchange={(e) => {
              setCardInfo((prev) => ({
                ...prev,
                card_num: e.target.value,
              }));
            }}
          />
          <EditInput
            title={getTranslation("889")}
            type="number"
            maxLength={24}
            value={cardInfo.shaba_num}
            onchange={(e) => {
              const inputValue = e.target.value;
              setCardInfo((prev) => ({
                ...prev,
                shaba_num: inputValue,
              }));
            }}
          />
        </Inputs>
        {errors.length > 0 && <ErrorMessage>{errors[0]}</ErrorMessage>}
        <Button onClick={addCard}> {getTranslation("890")}</Button>
      </Modal>
    </BackGround>
  );
};

export default AddBankCard;
