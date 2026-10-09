import { Tooltip as ReactTooltip } from "react-tooltip";
import pscpng from "../../../../assets/gif/psc.gif";
import rialpng from "../../../../assets/gif/rial.gif";
import styled from "styled-components";
import { useState } from "react";
import {
  convertToPersian,
  getTranslation,
  formatNumber,
} from "../../../../services/Utility";
import Button from "../../../../components/Button";
import { useNavigate } from "react-router";
import useRequest from "../../../../services/Hooks/useRequest";

const PhotoName = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ImageWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.color};
`;

const Name = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
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

const Address = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 14px;
    font-weight: 600;
  }

  p {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;

const Meter = styled.div`
  display: flex;
  text-align: center;
  flex-direction: column;
  gap: 4px;

  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 14px;
    font-weight: 600;
  }

  p {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
  }
`;

const Price = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;

  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 14px;
    font-weight: 600;
  }
`;

const Div = styled.div`
  display: flex;
  gap: 12px;

  @media screen and (max-width: 748px) {
    flex-direction: column;
  }

  div {
    display: flex;
    gap: 6px;
  }
`;

const Delete = styled.div`
  font-size: 16px;
  color: #c30000;
  white-space: nowrap;
  font-weight: 600;
  background-color: #c3000026;
  border-radius: 10px;
  padding: 10px 0px;
  text-align: center;
  cursor: ${(props) => (props.loading ? "not-allowed" : "pointer")};
  pointer-events: ${(props) => (props.loading ? "none" : "auto")};
  opacity: ${(props) => (props.loading ? "0.6" : "1")};

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const DeleteSpinner = styled.span`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(195, 0, 0, 0.3);
  border-top: 2px solid #c30000;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

const Left = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 130px;
`;

const Right = styled.div`
  display: grid;
  align-items: center;
  gap: 20px;
  grid-template-columns: 2fr 50%;
`;

const Container = styled.div`
  display: grid;
  align-items: center;
  gap: 20px;
  grid-template-columns: 1fr;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  padding: 10px 10px 10px 20px;
  border-radius: 5px;

  @media (min-width: 1400px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
`;

const StyledTooltip = styled(ReactTooltip)`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  width: 265px;
  text-align: center;

  &.place-top {
    margin-bottom: 10px;
  }
`;

const CardItem = ({
  name,
  id,
  color,
  address,
  stability,
  photo,
  navigateId,
  forSale,
  sellReq,
}) => {
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const Navigate = useNavigate();

  const formattedRial = convertToPersian(formatNumber(sellReq?.price_irr));
  const formattedPsc = convertToPersian(formatNumber(sellReq?.price_psc));

  const [isDeleted, setIsDeleted] = useState(Number(forSale) === 1);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const handleDelete = () => {
    if (isDeleteLoading) return;
    if (!checkSecurity()) return;

    setIsDeleteLoading(true);

    Request(`sell-requests/${sellReq.id}`, HTTP_METHOD.DELETE)
      .then(() => {
        setIsDeleted(!isDeleted);
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      })
      .finally(() => {
        setIsDeleteLoading(false);
      });
  };

  const handlePriceDefine = () => {
    if (isPriceLoading) return;

    setIsPriceLoading(true);

    Navigate(`/feature/${navigateId}/sell/PriceDefine`, {
      state: {
        from: location.pathname,
      },
    });
  };

  return (
    <Container>
      <Right>
        <PhotoName>
          <ImageWrapper color={color}>
            <img src={photo} />
          </ImageWrapper>

          <Name>
            <h3>{getTranslation(name)}</h3>

            <span
              onClick={() =>
                Navigate(`/feature/${navigateId}/info`, {
                  state: {
                    from: location.pathname,
                  },
                })
              }
            >
              {id}
            </span>
          </Name>
        </PhotoName>

        <Address>
          <span>{getTranslation("59")}</span>
          <p data-tooltip-id={address}>{address}</p>
          <StyledTooltip id={address} place="top" content={address} />
        </Address>
      </Right>

      <Left>
        <Meter>
          <span>{getTranslation("347")}</span>
          <p>{convertToPersian(formatNumber(stability))}</p>
        </Meter>

        {!isDeleted ? (
          <div />
        ) : (
          <Price>
            <span>{getTranslation("60")}</span>

            <Div>
              <div>
                <img width={24} height={24} src={rialpng} />
                <span>{formattedRial}</span>
              </div>

              <div>
                <img width={24} height={24} src={pscpng} />
                <span>{formattedPsc}</span>
              </div>
            </Div>
          </Price>
        )}

        {!isDeleted ? (
          <Button
            fit
            label={getTranslation("352")}
            disabled={isPriceLoading ? "pending" : false}
            onClick={handlePriceDefine}
          />
        ) : (
          <Delete $loading={isDeleteLoading} onClick={handleDelete}>
            {isDeleteLoading && <DeleteSpinner />}
            {getTranslation("736")}
          </Delete>
        )}
      </Left>
    </Container>
  );
};

export default CardItem;