import { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment-jalaali";
import TitleBody from "../../../../../components/TitleBody.jsx";
import Button from "../../../../../components/Button.jsx";
import ExpandableNote from "../ExpandableNote.jsx";
import { useIsRtl } from "../../../../../services/reducers/LanguageContext.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import useWalletUpdate from "../../../../../hooks/useWalletUpdate.js";

import {
  calculateFee,
  convertToPersian,
  getTranslation,
} from "../../../../../services/Utility/index";

import {
  BasePrice,
  Info,
  Prices,
  proposerContainer,
  Divider,
} from "../suggestionStyles";
import { COLOR_CONFIG } from "../../../../../services/constants/colorConfig.js";

const Container = proposerContainer;

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

  const [isExploding, setIsExploding] = useState(false);

  const isPersian = useIsRtl();

  const { Request, checkSecurity } = useRequest();

  const updateWallet = useWalletUpdate();

  const isFinished = !time.hours && !time.minutes && !time.seconds;

  useEffect(() => {
    if (isFinished) return;

    const countdown = setInterval(() => {
      setTime(tick);
    }, 1000);

    return () => clearInterval(countdown);
  }, [isFinished]);

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

      updateWallet("irr", calculateFee(item.price_irr), "+");
      updateWallet("psc", calculateFee(item.price_psc), "+");

      setTimeout(() => onRemoved?.(), 3000);
    } catch {
      // useRequest already displays request errors.
    }
  };

  return (
    <Container>
      <Info isPersian={isPersian}>
        <Price>
          <TitleBody title={getTranslation(773)} />

          <Prices>
            <PriceItem src={COLOR_CONFIG.irr.gif} value={item.price_irr} />

            <Divider />
            <PriceItem src={COLOR_CONFIG.psc.gif} value={item.price_psc} />
          </Prices>
        </Price>

        <ExpandableNote note={item.note} />
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
