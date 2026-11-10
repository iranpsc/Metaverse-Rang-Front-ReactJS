import Button from "../../../../../../components/Button.jsx";
import MemberCard from "./MemberCard.jsx";
import {
  getTranslation,
  ToastSuccess,
  ConvertJalali,
  convertToPersian,
  formatNumber,
} from "../../../../../../services/Utility/index.jsx";
import styled from "styled-components";
import gift from "../../../../../../assets/images/rewards/satisfy.png";
import ModalLg from "../../../../../../components/Modal/ModalLg.jsx";
import useRequest from "../../../../../../hooks/useRequest.js";
import useWalletUpdate from "../../../../../../hooks/useWalletUpdate.js";
import TitleBody from "../../../../../../components/TitleBody.jsx";
import { useRef, useState } from "react";
import { COLOR_CONFIG } from "../../../../../../services/constants/colorConfig.js";
import HtmlContent from "../../../../../../components/HtmlContent.jsx";
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

const ButtonWrap = styled.div`
  display: inline-flex;
`;

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
  const updateWallet = useWalletUpdate();
  const [isSending, setIsSending] = useState(false);
  const { Request, HTTP_METHOD } = useRequest();
  const rewardButtonRef = useRef(null);
  const [isExploding, setIsExploding] = useState(false);

  const handleReject = () => {
    Request(`dynasty/requests/recieved/${data.id}`, HTTP_METHOD.DELETE).then(
      () => {
        ToastSuccess(getTranslation(1852));
        setRows((prev) => prev.filter((row) => row.id !== data.id));

        setShowDetails(false);
      },
    );
  };
  const handleCancel = () => {
    Request(`dynasty/requests/sent/${data.id}`, HTTP_METHOD.DELETE).then(() => {
      ToastSuccess(getTranslation(1853));
      setRows((prev) => prev.filter((row) => row.id !== data.id));
      setShowDetails(false);
    });
  };
  const handleAccept = () => {
    Request(`dynasty/requests/recieved/${data.id}`, HTTP_METHOD.POST).then(
      () => {
        ToastSuccess(getTranslation(1854));
        setRows((prev) => prev.filter((row) => row.id !== data.id));

        setShowDetails(false);
      },
    );
  };
  const handleGift = async () => {
    if (isSending) return;

    setIsSending(true);

    try {
      await Request(`dynasty/prizes/${data.prize.id}`, HTTP_METHOD.POST);

      ToastSuccess(getTranslation("جایزه شما با موفقیت دریافت شد"));

      updateWallet("psc", Number(psc) || 0, "+");
      updateWallet("satisfaction", Number(gif) || 0, "+");
      setIsExploding(true);

      setTimeout(() => {
        setShowDetails(false);
      }, 800);
    } catch {
      // useRequest already displays request errors.
    } finally {
      setIsSending(false);
    }
  };

  const isSendType = type === "sent";
  return (
    <ModalLg setShowModal={setShowDetails} titleId={isSendType ? "113" : "114"}>
      <Container>
        <MemberCard
          status={status}
          date={ConvertJalali(date)}
          time={convertToPersian(time)}
          code={code}
          name={isSendType ? data?.to_user?.name : data?.from_user?.name}
          image={
            isSendType
              ? data?.to_user?.profile_photo
              : data?.from_user?.profile_photo
          }
        />
        <div style={{ marginTop: "30px" }}>
          <HtmlContent html={data.message} />
        </div>

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
        {Number(data?.status) === 1 && isSendType && (
          <RewardBox>
            <Rewards>
              <Reward>
                <TitleBody title={convertToPersian(formatNumber(gif ?? 0))} />
                <img src={gift} alt="" />
              </Reward>

              <Reward>
                <TitleBody title={convertToPersian(formatNumber(psc ?? 0))} />

                <img src={COLOR_CONFIG.psc.gif} alt="" />
              </Reward>
            </Rewards>

            <ButtonWrap ref={rewardButtonRef}>
              <Button
                disabled={isSending || data.prize.collected}
                onClick={handleGift}
                label={
                  data.prize.collected
                    ? "پاداش دریافت شده"
                    : getTranslation(856)
                }
                color={!data.prize.collected ? "#18C08F" : undefined}
                grayTheme={data.prize.collected}
                explode={isExploding}
                fit
                explosionColor="#18C08F"
              />
            </ButtonWrap>
          </RewardBox>
        )}
      </Container>
    </ModalLg>
  );
};

export default RequestDetails;
