import { useEffect, useMemo, useState, useContext } from "react";
import styled from "styled-components";
import moment from "moment-jalaali";

import line from "../../../../../assets/images/profile/Line.png";
import pscpng from "../../../../../assets/images/profile/psc.gif";
import rialpng from "../../../../../assets/images/profile/rial.gif";

import HtmlContent from "../../../../../components/HtmlContent.jsx";
import TitleBody from "../../../../../components/TitleBody.jsx";
import Button from "../../../../../components/Button.jsx";

import { useIsRtl } from "../../../../../hooks/useLanguageContext.js";
import useRequest from "../../../../../hooks/useRequest.js";

import {
  WalletContext,
  WalletContextTypes,
} from "../../../../../services/reducers/WalletContext";

import {
  calculateFee,
  convertToPersian,
  getTranslation,
  SanitizeHTML,
  ToastError,
} from "../../../../../services/Utility/index";

import {
  BasePrice,
  Info,
  Prices,
  Text,
  proposerContainer,
} from "../suggestionStyles";

const Container = proposerContainer;

const NOTE_LIMIT = 277;

const TIME_UNITS = [
  { key: "hours", label: "560" },
  { key: "minutes", label: "33" },
  { key: "seconds", label: "778" },
];

const Price = styled(BasePrice)`
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
`;

const ProposalStatus = styled.div`
  > :first-child {
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
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
  padding: 10px 20px;
  border-radius: 6px;
  max-width: 70px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 4px;
`;

const ToggleText = styled.span`
  cursor: pointer;
`;

const Buttons = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 16px;
`;


const getRemainingTime = (gracePeriod) => {
  if (!gracePeriod) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const graceDate = moment(gracePeriod, "jYYYY/jMM/jDD HH:mm:ss").toDate();

  const diffTime = Math.max(0, graceDate - new Date());

  return {
    hours: Math.floor(diffTime / (1000 * 60 * 60)),
    minutes: Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diffTime % (1000 * 60)) / 1000),
  };
};

const tick = ({ hours, minutes, seconds }) => {
  if (seconds > 0) {
    return { hours, minutes, seconds: seconds - 1 };
  }

  if (minutes > 0) {
    return { hours, minutes: minutes - 1, seconds: 59 };
  }

  if (hours > 0) {
    return { hours: hours - 1, minutes: 59, seconds: 59 };
  }

  return { hours: 0, minutes: 0, seconds: 0 };
};

const PriceItem = ({ src, value }) => (
  <div>
    <img width={24} height={24} src={src} alt="Currency" />
    <TitleBody title={convertToPersian(value)} />
  </div>
);


const Proposer = ({ item, onRemoved }) => {
  const [time, setTime] = useState(() =>
    getRemainingTime(item.requested_grace_period),
  );

  const [isExpanded, setIsExpanded] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const isPersian = useIsRtl();

  const { Request, checkSecurity } = useRequest();

  const [Wallet, dispatch] = useContext(WalletContext);

  const isFinished = !time.hours && !time.minutes && !time.seconds;

  useEffect(() => {
    if (isFinished) return;

    const countdown = setInterval(() => {
      setTime(tick);
    }, 1000);

    return () => clearInterval(countdown);
  }, [isFinished]);

  const information = item.note || "";
  const isLongNote = information.length > NOTE_LIMIT;

  const noteHtml = useMemo(() => {
    const text =
      isLongNote && !isExpanded
        ? `${information.slice(0, NOTE_LIMIT)}...`
        : information;

    return SanitizeHTML(text);
  }, [information, isLongNote, isExpanded]);

  const handleReject = async () => {
    if (!checkSecurity()) return;

    try {
      /** */
      const response = await Request(
        `buy-requests/delete/${item.id}`,
        "DELETE",
        {},
        {},
        "production",
      );

      if (![200, 204].includes(response.status)) return;

      setIsExploding(true);

      dispatch({
        type: WalletContextTypes.ADD_WALLET,
        payload: {
          ...Wallet,
          irr: Wallet.irr + calculateFee(item.price_irr),
          psc: Wallet.psc + calculateFee(item.price_psc),
        },
      });

      setTimeout(() => onRemoved?.(), 3000);
    } catch (error) {
      ToastError(error?.response?.data?.message);
    }
  };

  return (
    <Container>
      <Info isPersian={isPersian}>
        <Price>
          <TitleBody title={getTranslation(773)} />

          <Prices>
            <PriceItem src={rialpng} value={item.price_irr} />

            <img width={1} height={24} src={line} alt="Line" />

            <PriceItem src={pscpng} value={item.price_psc} />
          </Prices>
        </Price>

        <Text>
          <HtmlContent html={noteHtml} />

          {isLongNote && (
            <ToggleText onClick={() => setIsExpanded((prev) => !prev)}>
              <TitleBody
                primary
                title={getTranslation(isExpanded ? "884" : "774")}
              />
            </ToggleText>
          )}
        </Text>
      </Info>

      <ProposalStatus>
        <TitleBody gray title={getTranslation("777")} />

        <TimeSection>
          {TIME_UNITS.map(({ key, label }) => (
            <TimeBox key={key}>
              <TitleBody
                title={convertToPersian(String(time[key]).padStart(2, "0"))}
              />

              <TitleBody gray title={getTranslation(label)} />
            </TimeBox>
          ))}
        </TimeSection>

        <Buttons>
          <Button
            textColor="#fff"
            full
            label={getTranslation("775")}
            color="#C30000"
            explode={isExploding}
            explosionColor="#C30000"
            onClick={handleReject}
          />
        </Buttons>
      </ProposalStatus>
    </Container>
  );
};

export default Proposer;
