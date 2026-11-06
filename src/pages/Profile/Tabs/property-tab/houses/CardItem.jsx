// کارت نمایش یک ملک در لیست دارایی‌ها (عکس، نام، آدرس، پایداری، قیمت فروش) با دکمه‌ی تعیین قیمت یا لغو درخواست فروش؛ مناسب لیست املاک من یا املاک یک بازیکن

import styled from "styled-components";
import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import pscIcon from "../../../../../assets/gif/psc.gif";
import rialIcon from "../../../../../assets/gif/rial.gif";
import Button from "../../../../../components/Button.jsx";
import LandText from "../../../../../components/LandText.jsx";
import TitleBody from "../../../../../components/TitleBody.jsx";
import ToolTip from "../../../../../components/Tooltip/Tooltip.jsx";
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
  white-space: wrap;
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
  align-items: ${({ $center }) => ($center ? "center" : "stretch")};
  gap: 4px;
  text-align: ${({ $center }) => ($center ? "center" : "start")};
`;

// آدرس بیشتر از دو خط با سه‌نقطه کوتاه می‌شود
const AddressClamp = styled.div`
  min-width: 0;

  & > * {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;

    overflow-wrap: anywhere;
  }
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
  const addressRef = useRef(null);

  const [isForSale, setIsForSale] = useState(Number(forSale) === 1);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  // فقط وقتی آدرس واقعاً بریده شده تولتیپ فعال می‌شود
  useLayoutEffect(() => {
    const el = addressRef.current?.firstElementChild;
    if (!el) return;

    const check = () => setIsTruncated(el.scrollHeight > el.clientHeight);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [address]);

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
            <TitleBody weight title={getTranslation(name)} />
            <LandText to={`/feature/${navigateId}/info`} label={id} />
          </Name>
        </PhotoName>

        <Field>
          <TitleBody weight title={getTranslation(59)} />

          <ToolTip
            content={address}
            place="top"
            width="auto"
            height="auto"
            disabled={!isTruncated}
            Chidren={
              <AddressClamp ref={addressRef}>
                <TitleBody small title={address} />
              </AddressClamp>
            }
          />
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
                <img width={24} height={24} src={rialIcon} alt="" />
                <TitleBody title={formatPrice(sellReq?.price_irr)} />
              </PriceItem>
              <PriceItem>
                <img width={24} height={24} src={pscIcon} alt="" />
                <TitleBody title={formatPrice(sellReq?.price_psc)} />
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
            onClick={() =>
              navigate(`/feature/${navigateId}/sell/PriceDefine`, {
                state: { from: pathname },
              })
            }
          />
        )}
      </Left>
    </Container>
  );
};

export default CardItem;
