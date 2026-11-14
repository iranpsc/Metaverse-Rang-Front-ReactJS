import { addCommas } from "@persian-tools/persian-tools";
import { useState } from "react";
import { BsExclamationCircleFill } from "react-icons/bs";
import styled from "styled-components";
import Button from "../../../components/Button";
import useRequest from "../../../hooks/useRequest.js";
import { getTranslation } from "../../../services/Utility";
import InfoModal from "./InfoModal";
import TitleValue from "./TitleValue";

// نوع دارایی => شناسه‌ی ترجمه
const ASSET_TRANSLATION_IDS = {
  yellow: "11",
  red: "12",
  blue: "49",
  irr: "906",
  psc: "47",
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 10px 20px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
`;

const Product = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const PhotoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  padding: 2px;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bgOne};

  @media (max-width: 840px) {
    width: 60px;
    height: 60px;

    img {
      width: 34px;
      height: 34px;
    }
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    z-index: 99;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
    color: ${({ theme }) => theme.colors.newColors.otherColors.btnIconBg};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

// دایره‌ی سفید پشت آیکون
const IconDot = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: white;
`;

const InfoRow = ({ data, shop }) => {
  const { Request, HTTP_METHOD } = useRequest();

  const [openModal, setOpenModal] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const assetTranslationId = ASSET_TRANSLATION_IDS[data.asset];
  const totalPrice = addCommas((data.amount * data.unitPrice) / 10);

  const handlePayment = async () => {
    setIsBuying(true);

    try {
      const response = await Request("order", HTTP_METHOD.POST, {
        asset: data.asset,
        amount: data.amount,
      });

      window.location.href = response?.data?.link;
    } catch (error) {
      console.error("Payment error:", error);
      setIsBuying(false);
    }
  };

  return (
    <>
      <Wrapper>
        <Product>
          <PhotoContainer>
            <IconWrapper>
              <IconDot />
              <BsExclamationCircleFill onClick={() => setOpenModal(true)} />
            </IconWrapper>
            <img width={54} height={54} alt="" src={data.image} />
          </PhotoContainer>

          <TitleValue
            shop={shop}
            title={getTranslation("511")}
            value={assetTranslationId ? getTranslation(assetTranslationId) : ""}
          />
        </Product>

        <TitleValue
          shop={shop}
          title={getTranslation("510")}
          value={`${data.amount.toLocaleString()} ${getTranslation("14")}`}
        />

        <TitleValue
          shop={shop}
          title={getTranslation("509")}
          value={`${totalPrice} ${getTranslation("10")}`}
        />

        <Button
          row
          label={getTranslation("353")}
          onClick={handlePayment}
          disabled={isBuying ? "pending" : false}
        />
      </Wrapper>

      {openModal && <InfoModal data={data} setOpenModal={setOpenModal} />}
    </>
  );
};

export default InfoRow;
