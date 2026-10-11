import Button from "../../../../../components/Button";
import MemberCard from "./MemberCard";
import {
  getTranslation,
  ToastError,
  ToastSuccess,
  SanitizeHTML,
  ConvertJalali,
  convertToPersian,
} from "../../../../../services/Utility";
import { createPortal } from "react-dom";
import ConfettiExplosion from "react-confetti-explosion";
import styled from "styled-components";
import gift from "../../../../../assets/images/satisfy.png";
import pscGif from "../../../../../assets/gif/psc.gif";
import ModalLg from "../../../../../components/Modal/ModalLg";
import useRequest from "../../../../../services/Hooks/useRequest";
import { WalletContext, WalletContextTypes } from "../../../../../services/reducers/WalletContext";
import { useContext, useState, useRef } from "react";
const Container = styled.div`
  max-height: 100%;
  overflow-y: auto;
  padding: 5px;
  padding-bottom: 40px;
`;
const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 30px;
`;

const Texts = styled.div`
  padding-top: 30px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 400;
  &:last-of-type {
    font-weight: 600;
    color: ${(props) => props.theme.colors.newColors.otherColors.title};
  }
`;
const RewardBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
    color: ${(props) => props.theme.colors.newColors.shades.title};

  margin-top: 30px;
`;

const Rewards = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
`;

const Reward = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 500;

  img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
const ConfettiAnchor = styled.div`
  position: fixed;
  width: 0;
  height: 0;
  z-index: 9999;
  pointer-events: none;
`;

const ButtonWrap = styled.div`
  display: inline-flex;
`;

const ConfettiEffect = ({ x, y, onComplete }) =>
  createPortal(
    <ConfettiAnchor style={{ left: x, top: y }}>
      <ConfettiExplosion
        zIndex={9999}
        particleCount={150}
        duration={3000}
        colors={["#18C08F"]}
        particleSize={5}
        width={400}
        height="100vh"
        onComplete={onComplete}
      />
    </ConfettiAnchor>,
    document.body,
  );
const RequestDetails = ({
  setShowDetails,
  status,
  code,
  date,
  time,
  setRows,
  data,
  type,
  gif,
  psc,
}) => {
  const [Wallet, dispatch] = useContext(WalletContext);
  const [isSending, setIsSending] = useState(false);

  const { Request, HTTP_METHOD } = useRequest();
  const rewardButtonRef = useRef(null);
  const [confettiOrigin, setConfettiOrigin] = useState(null);
  const handleReject = () => {
    Request(`dynasty/requests/recieved/${data.id}`, HTTP_METHOD.DELETE)
      .then(() => {
        ToastSuccess(getTranslation(1852));
        setRows((prev) => prev.filter((row) => row.id !== data.id));

        setShowDetails(false);
      })
      .catch((error) => {
        ToastError(error.response.data.message);
      });
  };
  const handleCancel = () => {
    Request(`dynasty/requests/sent/${data.id}`, HTTP_METHOD.DELETE)
      .then(() => {
        ToastSuccess(getTranslation(1853));
        setRows((prev) => prev.filter((row) => row.id !== data.id));
        setShowDetails(false);
      })
      .catch((error) => {
        ToastError(error.response.data.message);
      });
  };
  const handleAccept = () => {
    Request(`dynasty/requests/recieved/${data.id}`, HTTP_METHOD.POST)
      .then(() => {
        ToastSuccess(getTranslation(1854));
        setRows((prev) => prev.filter((row) => row.id !== data.id));

        setShowDetails(false);
      })
      .catch((error) => {
        ToastError(error.response.data.message);
      });
  };
  const handleGift = async () => {
    // جلوگیری از درخواست تکراری
    if (isSending) return;

    setIsSending(true);

    try {
      await Request(`dynasty/prizes/${data.id}`, HTTP_METHOD.POST);

      ToastSuccess(getTranslation("جایزه شما با موفقیت دریافت شد"));

      const rect = rewardButtonRef.current?.getBoundingClientRect();

      if (rect) {
        setConfettiOrigin({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          key: Date.now(),
        });
      }

      dispatch({
        type: WalletContextTypes.ADD_WALLET,
        payload: {
          ...Wallet,
          psc: Wallet.psc + psc,
          satisfaction: Wallet.satisfaction + gif,
        },
      });

      setTimeout(() => {
        setShowDetails(false);
      }, 800);
    } catch (error) {
      ToastError(error.response?.data?.message || "خطا در دریافت پاداش");
    } finally {
      setIsSending(false);
    }
  };
  const isSendType = type === "sent" ? true : false;
  return (
    <ModalLg setShowModal={setShowDetails} titleId={isSendType ? "113" : "114"}>
      <Container>
        <MemberCard
          status={status}
          date={ConvertJalali(date)}
          time={convertToPersian(time)}
          code={code}
          name={data.from_user.name}
          image={data?.from_user?.profile_photo}
        />

        <Texts>{SanitizeHTML(data.message)}</Texts>

        <Buttons>
          {data?.status === 0 && !isSendType && (
            <Button
              label={getTranslation(823)}
              color="#18C08F"
              onClick={handleAccept}
              fit
              textColor="#D7FBF0"
            />
          )}
          {data?.status === 0 && (
            <Button
              label={!isSendType ? getTranslation(824) : getTranslation(833)}
              color="#C30000"
              onClick={!isSendType ? handleReject : handleCancel}
              fit
              textColor="#FFFFFF"
            />
          )}
        </Buttons>
        {(Number(data?.status) === 1 && isSendType) && (

          <RewardBox>

            <Rewards>
              <Reward>
                {" "}
                <span>{convertToPersian(gif ?? 0)}</span>
                <img src={gift} alt="" />
              </Reward>

              <Reward>
                {" "}
                <span>{convertToPersian(psc ?? 0)}</span>
                <img src={pscGif} alt="" />
              </Reward>
            </Rewards>

            <ButtonWrap ref={rewardButtonRef}>
              <Button
                disabled={isSending}
                onClick={handleGift}
                label={getTranslation(856)}
                color="#18C08F"
                textColor="#D7FBF0"
                fit
              />
            </ButtonWrap>

            {confettiOrigin && (
              <ConfettiEffect
                key={confettiOrigin.key}
                x={confettiOrigin.x}
                y={confettiOrigin.y}
                onComplete={() => setConfettiOrigin(null)}
              />
            )}
          </RewardBox>
        )}
      </Container>
    </ModalLg>
  );
};

export default RequestDetails;
