// کارت نمایش یک ملک در لیست دارایی‌ها (عکس، نام، آدرس، پایداری، قیمت فروش) با دکمه‌ی تعیین قیمت یا لغو درخواست فروش؛ مناسب لیست املاک من یا املاک یک بازیکن

import styled from "styled-components";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Button from "../../../../../components/Button.jsx";
import LandText from "../../../../../components/LandText.jsx";
import TitleBody from "../../../../../components/TitleBody.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import {
  convertToPersian,
  formatNumber,
  getTranslation,
} from "../../../../../services/Utility/index.jsx";
import { COLOR_CONFIG } from "../../../../../services/constants/colorConfig.js";
import TruncatedText from "../../../../../components/TruncatedText.jsx";

const formatPrice = (value) => convertToPersian(formatNumber(value));

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 20px;
  padding: 10px 10px 10px 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 1400px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;

const Right = styled.div`
  display: grid;
  grid-template-columns: 2fr 50%;
  align-items: center;
  gap: 20px;
`;

const Left = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 130px;
  align-items: center;
  white-space: wrap;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const PhotoName = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 5px;
  background-color: ${({ $color }) => $color};
`;

const Name = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.newColors.shades.title};

    @media (min-width: 1400px) {
      font-size: 16px;
    }
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 4px;
  padding-inline-start: 5px;
  text-align: ${({ $center }) => ($center ? "center" : "start")};
`;

const Prices = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 748px) {
    flex-direction: column;
  }
`;

const PriceItem = styled.div`
  display: flex;
  gap: 6px;
`;

const CardItem = ({
  id,
  name,
  color,
  address,
  stability,
  photo,
  navigateId,
  forSale,
  sellReq,
}) => {
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isForSale, setIsForSale] = useState(Number(forSale) === 1);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDelete = () => {
    if (isDeleteLoading || !checkSecurity()) return;

    setIsDeleteLoading(true);

    Request(`sell-requests/${sellReq?.id}`, HTTP_METHOD.DELETE)
      .then(() => setIsForSale(false))
      .catch((error) => console.error("Delete failed:", error))
      .finally(() => setIsDeleteLoading(false));
  };

  return (
    <Container>
      <Right>
        <PhotoName>
          <ImageWrapper $color={color}>
            <img src={photo} alt="" />
          </ImageWrapper>

          <Name>
            <TitleBody noWrap weight title={getTranslation(name)} />
            <LandText to={`/feature/${navigateId}/info`} label={id} noWrap />
          </Name>
        </PhotoName>

        <Field>
          <TitleBody weight title={getTranslation(59)} />
          <TruncatedText text={address} reservedSpace={20} />
        </Field>
      </Right>

      <Left>
        <Field $center>
          <TitleBody weight title={getTranslation(347)} />
          <TitleBody title={formatPrice(stability)} />
        </Field>

        {isForSale ? (
          <Field $center>
            <TitleBody weight title={getTranslation(60)} />

            <Prices>
              <PriceItem>
                <img width={24} height={24} src={COLOR_CONFIG.irr.gif} alt="" />
                <TitleBody title={formatPrice(sellReq?.price_irr)} />
              </PriceItem>
              <PriceItem>
                <img width={24} height={24} src={COLOR_CONFIG.psc.gif} alt="" />
                <TitleBody title={formatPrice(sellReq?.price_psc)} />
              </PriceItem>
            </Prices>
          </Field>
        ) : (
          <div />
        )}
        <ButtonContainer>
          {" "}
          {isForSale ? (
            <Button
              color="#c3000026"
              textColor="#c30000"
              label={getTranslation("736")}
              disabled={isDeleteLoading ? "pending" : false}
              onClick={handleDelete}
            />
          ) : (
            <Button
              label={getTranslation("352")}
              onClick={() =>
                navigate(`/feature/${navigateId}/sell/PriceDefine`, {
                  state: { from: pathname },
                })
              }
            />
          )}
        </ButtonContainer>
      </Left>
    </Container>
  );
};

export default CardItem;
