// کارت نمایش یک ملک در لیست دارایی‌ها (عکس، نام، آدرس، پایداری، قیمت فروش) با دکمه‌ی تعیین قیمت یا لغو درخواست فروش؛ مناسب لیست املاک من یا املاک یک بازیکن

import styled from "styled-components";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Tooltip as ReactTooltip } from "react-tooltip";
import pscIcon from "../../../../../assets/gif/psc.gif";
import rialIcon from "../../../../../assets/gif/rial.gif";
import Button from "../../../../../components/Button.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import {
  convertToPersian,
  formatNumber,
  getTranslation,
} from "../../../../../services/Utility/index.jsx";
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
`;

const PhotoName = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background-color: ${({ $color }) => $color};
`;

const Name = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    font-size: 14px;
    font-weight: 600;

    @media (min-width: 1400px) {
      font-size: 16px;
    }
  }

  span {
    color: #ffc700;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    cursor: pointer;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $center }) => ($center ? "center" : "stretch")};
  text-align: ${({ $center }) => ($center ? "center" : "start")};
  gap: 4px;
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-size: 14px;
  font-weight: 600;
`;

const Value = styled.p`
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 400;
`;

const AddressText = styled(Value)`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
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

const StyledTooltip = styled(ReactTooltip)`
  width: 265px;
  border-radius: 10px;
  text-align: center;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  &.place-top {
    margin-bottom: 10px;
  }
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

  const tooltipId = `address-${navigateId}`;

  const goTo = (path) => navigate(path, { state: { from: pathname } });

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
            <h3>{getTranslation(name)}</h3>
            <span onClick={() => goTo(`/feature/${navigateId}/info`)}>
              {id}
            </span>
          </Name>
        </PhotoName>

        <Field>
          <Label>{getTranslation("59")}</Label>
          <AddressText data-tooltip-id={tooltipId}>{address}</AddressText>
          <StyledTooltip id={tooltipId} place="top" content={address} />
        </Field>
      </Right>

      <Left>
        <Field $center>
          <Label>{getTranslation("347")}</Label>
          <Value>{formatPrice(stability)}</Value>{" "}
        </Field>

        {isForSale ? (
          <Field $center>
            <Label>{getTranslation("60")}</Label>
            <Prices>
              <PriceItem>
                <img width={24} height={24} src={rialIcon} alt="" />
                <Label>{formatPrice(sellReq?.price_irr)}</Label>
              </PriceItem>
              <PriceItem>
                <img width={24} height={24} src={pscIcon} alt="" />
                <Label>{formatPrice(sellReq?.price_psc)}</Label>
              </PriceItem>
            </Prices>
          </Field>
        ) : (
          <div />
        )}

        {isForSale ? (
          <Button
            full
            color="#c3000026"
            textColor="#c30000"
            label={getTranslation("736")}
            disabled={isDeleteLoading ? "pending" : false}
            onClick={handleDelete}
          />
        ) : (
          <Button
            fit
            label={getTranslation("352")}
            onClick={() => goTo(`/feature/${navigateId}/sell/PriceDefine`)}
          />
        )}
      </Left>
    </Container>
  );
};

export default CardItem;
