// Proposer.jsx
import { useEffect, useState, useContext } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import {
  convertToPersian,
  getTranslation,
  SanitizeHTML,
  ToastError, calculateFee
} from "../../../../../services/Utility/index";
import line from "../../../../../assets/images/profile/Line.png";
import pscpng from "../../../../../assets/images/profile/psc.gif";
import rialpng from "../../../../../assets/images/profile/rial.gif";
import styled from "styled-components";
import moment from "moment-jalaali";
import { useLanguage } from "../../../../../hooks/useLanguageContext.js";
import useRequest from "../../../../../hooks/useRequest.js";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../../services/reducers/WalletContext";
import {
  Info,
  proposerContainer,
  BasePrice,
  Prices,
  RejectButton,
  Text,
} from "../suggestionStyles";

const Price = styled(BasePrice)`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};
`;

const ProposalStatus = styled.div`
  p {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 10px;
  }
`;

const TimeSection = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-between;
  padding: 10px;
  border-radius: 6px;
`;

const TimeBox = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};
  padding: 10px 20px;
  border-radius: 6px;
  max-width: 70px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.colors.newColors.shades[30]};
  font-size: 16px;
  font-weight: 500;
  text-align: center;

  span {
    font-size: 13px;
    font-weight: 600;
    margin-top: 4px;
    color: #a0a0ab;
  }
`;

const Buttons = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 16px;
`;

const Container = proposerContainer;

const getRemainingTime = (gracePeriod) => {
  if (!gracePeriod) return { hours: 0, minutes: 0, seconds: 0 };
  const graceDate = moment(gracePeriod, "jYYYY/jMM/jDD HH:mm:ss").toDate();
  const diffTime = Math.max(0, graceDate - new Date());
  return {
    hours: Math.floor(diffTime / (1000 * 60 * 60)),
    minutes: Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diffTime % (1000 * 60)) / 1000),
  };
};

const PriceItem = ({ src, value }) => (
  <div>
    <img width={24} height={24} src={src} alt="Currency" />
    <span>{convertToPersian(value)}</span>
  </div>
);

const ConfettiEffect = () => (
  <ConfettiExplosion
    zIndex={9999}
    particleCount={150}
    duration={3000}
    colors={["#C30000"]}
    particleSize={5}
    height="100vh"
    width={400}
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
    }}
  />
);

const Proposer = ({ item, onRemoved }) => {
  const [time, setTime] = useState(() =>
    getRemainingTime(item.requested_grace_period),
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const isPersian = useLanguage();
  const { Request, checkSecurity } = useRequest();
  const [Wallet, dispatch] = useContext(WalletContext);

  const information = item.note || "";

  useEffect(() => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) return;

    const countdown = setInterval(() => {
      setTime(({ hours, minutes, seconds }) => {
        if (seconds > 0) return { hours, minutes, seconds: seconds - 1 };
        if (minutes > 0) return { hours, minutes: minutes - 1, seconds: 59 };
        if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
        clearInterval(countdown);
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [time]);

  const handleReject = async () => {
    if (!checkSecurity()) return;
    try {
      const response = await Request(
        `buy-requests/delete/${item.id}`,
        "DELETE",
        {},
        {},
        "production",
      );

      if ([200, 204].includes(response.status)) {
        setIsExploding(true);
        setTimeout(() => onRemoved?.(), 1000);

        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: {
            ...Wallet,
            irr: Wallet.irr + calculateFee(item.price_irr),
            psc: Wallet.psc + calculateFee(item.price_psc)
          },
        });
      }


    } catch (error) {
      ToastError(error?.response?.data?.message);
    }
  };

  return (
    <Container>
      <Info isPersian={isPersian}>
        <Price>
          <h3>{getTranslation("773")}</h3>
          <Prices>
            <PriceItem src={rialpng} value={item.price_irr} />
            <img width={1} height={24} src={line} alt="Line" />
            <PriceItem src={pscpng} value={item.price_psc} />
          </Prices>
        </Price>
        <Text>
          <p
            dangerouslySetInnerHTML={{
              __html:
                information.length > 277
                  ? isExpanded
                    ? SanitizeHTML(information)
                    : SanitizeHTML(`${information.slice(0, 277)}...`)
                  : SanitizeHTML(information),
            }}
          />
          {information.length > 277 && (
            <span onClick={() => setIsExpanded(!isExpanded)}>
              {getTranslation(isExpanded ? "884" : "774")}
            </span>
          )}
        </Text>
      </Info>
      <ProposalStatus>
        <p>{getTranslation("777")}</p>
        <TimeSection>
          {["hours", "minutes", "seconds"].map((unit, index) => (
            <TimeBox key={index}>
              {convertToPersian(time[unit].toString().padStart(2, "0"))}
              <span>{getTranslation(["560", "33", "778"][index])}</span>
            </TimeBox>
          ))}
        </TimeSection>
        <Buttons>
          <RejectButton onClick={handleReject}>
            {getTranslation("775")}
            {isExploding && <ConfettiEffect />}
          </RejectButton>
        </Buttons>
      </ProposalStatus>
    </Container>
  );
};

export default Proposer;