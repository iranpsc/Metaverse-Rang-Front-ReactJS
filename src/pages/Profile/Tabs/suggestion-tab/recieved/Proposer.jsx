// کارت پیشنهاد خرید روی ملک (خریدار، قیمت، درصد سود/ضرر، مهلت و دکمه‌های رد/قبول)؛ مناسب لیست پیشنهادهای دریافتی مالک که هر پیشنهاد را رد یا قبول می‌کند یا مهلت می‌دهد

import { useState } from "react";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import styled from "styled-components";
import moment from "moment-jalaali";

import DefaultProfile from "../../../../../assets/images/avatars/defulte-profile.webp";

import Button from "../../../../../components/Button";
import HtmlContent from "../../../../../components/HtmlContent.jsx";
import TitleBody from "../../../../../components/TitleBody.jsx";
import UserCode from "../../../../../components/UserCode.jsx";
import { useIsRtl } from "../../../../../services/reducers/LanguageContext.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import useWalletUpdate from "../../../../../hooks/useWalletUpdate.js";
import {
  calculateTotalIrr,
  convertToPersian,
  formatNumber,
  getTranslation,
} from "../../../../../services/Utility/index";
import {
  BasePrice,
  Info,
  Prices,
  proposerContainer,
  Text,Divider
} from "../suggestionStyles";
import { COLOR_CONFIG } from "../../../../../services/constants/colorConfig.js";

const Container = proposerContainer;

const NOTE_LIMIT = 277;
const SUCCESS_STATUSES = [200, 204];
const GRACE_OPTIONS = [7, 1];
const MS_PER_DAY = 1000 * 60 * 60 * 24;
const REJECT_COLOR = "#c30000";
const ACCEPT_COLOR = "#18C08F";

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Person = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    border-radius: 100%;
  }
`;

const ToggleText = styled.span`
  cursor: pointer;
`;

const Days = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};

  button {
    background-color: ${({ theme }) =>
      theme.colors.newColors.otherColors.iconBg};
    white-space: nowrap;
    font-size: 16px;
    padding: 8px;
    font-weight: 600;
  }
`;

const RemainedWrapper = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid #a0a0ab;
`;

const Remained = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 22px;
  border-radius: 10px;
  border: 1px solid #a0a0ab;
`;

const Buttons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;

  @media (min-width: 1366px) {
    grid-template-columns: 1fr;
  }
`;

const StyledArrowUp = styled(MdOutlineKeyboardArrowUp)`
  color: ${({ $isPositive }) => ($isPositive ? "#18C08F" : "#FF0000")};
  rotate: ${({ $isPositive }) => ($isPositive ? "" : "180deg")};
`;



const getGraceRemainingDays = (gracePeriod) => {
  if (!gracePeriod) return 0;

  const graceDate = moment(gracePeriod, "jYYYY/jMM/jDD HH:mm:ss").toDate();
  return Math.max(0, Math.ceil((graceDate - new Date()) / MS_PER_DAY));
};


const calculateProfitPercent = (buyerPrice, finalPrice) => {
  if (!finalPrice) return null;
  return ((buyerPrice - finalPrice) / finalPrice) * 100;
};

const PriceItem = ({ src, value }) => (
  <div>
    <img width={24} height={24} src={src} alt="" />
    <TitleBody title={convertToPersian(formatNumber(value))} />
  </div>
);

const Proposer = ({ item, finalPrice, onRemoved }) => {
  const [day, setDay] = useState(() =>
    getGraceRemainingDays(item.requested_grace_period),
  );
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isExplodingAccept, setIsExplodingAccept] = useState(false);
  const updateWallet = useWalletUpdate();
  const isPersian = useIsRtl();
  const { Request, checkSecurity } = useRequest();

  const { buyer, feature_properties: feature } = item;

  // پیشنهاد خریدار به ریال (ریال + psc تبدیل‌شده)
  const buyerPrice = calculateTotalIrr(item.price_irr, item.price_psc);
  const percent = calculateProfitPercent(buyerPrice, finalPrice);
  const hasPercent = percent !== null;

  const information = item.note || "";
  const isLongNote = information.length > NOTE_LIMIT;

  const noteHtml =
    isLongNote && !isExpanded
      ? `${information.slice(0, NOTE_LIMIT)}...`
      : information;

  const performAction = async (endpoint, onSuccess) => {
    if (!checkSecurity()) return;

    try {
      const response = await Request(
        `buy-requests/${endpoint}/${item.id}`,
        "POST",
      );
      if (SUCCESS_STATUSES.includes(response.status)) onSuccess();
    } catch {
      // useRequest already displays request errors.
    }
  };

  const handleGracePeriod = async (selectedDay) => {
    if (!checkSecurity()) return;

    try {
      const formData = new FormData();
      formData.append("grace_period", selectedDay);

      await Request(
        `buy-requests/add-grace-period/${item.id}`,
        "POST",
        formData,
        {},
        "production",
      );
      setDay(selectedDay);
    } catch {
      // useRequest already displays request errors.
    }
  };

  const handleReject = () =>
    performAction("reject", () => {
      setIsExploding(true);
      setTimeout(() => onRemoved?.(), 1000);
    });

  const handleAccept = () =>
    performAction("accept", () => {
      setIsExplodingAccept(true);
      setTimeout(() => onRemoved?.(), 100);

      updateWallet("irr", Number(feature?.price_irr) || 0, "+");
      updateWallet("psc", Number(feature?.price_psc) || 0, "+");
    });

  return (
    <Container>
      <Info isPersian={isPersian}>
        <Header>
          <Person>
            <img
              src={buyer?.profile_photo || DefaultProfile}
              alt={buyer?.code}
              width={60}
              height={60}
              onError={(e) => {
                e.target.src = DefaultProfile;
              }}
            />
            <div>
              <TitleBody gray title={getTranslation("768")} />
              <UserCode code={buyer?.code} />
            </div>
          </Person>

          <div>
            <TitleBody gray title={getTranslation("769")} />
            <TitleBody title={convertToPersian(item.created_at)} />
          </div>
        </Header>

        <BasePrice percent={percent}>
          <TitleBody title={getTranslation("773")} />
          <Prices percent={percent}>
            <PriceItem src={COLOR_CONFIG.irr.gif} value={item.price_irr} />
            <Divider />
            <PriceItem src={COLOR_CONFIG.psc.gif} value={item.price_psc} />
            {hasPercent && (
              <>
                <Divider />
                <div>
                  <StyledArrowUp $isPositive={percent > 0} />
                  <TitleBody
                    title={`${convertToPersian(
                      formatNumber(Math.abs(percent)),
                    )}%`}
                  />
                </div>
              </>
            )}
          </Prices>
        </BasePrice>

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

      <div>
        {day === 0 ? (
          <Days>
            {GRACE_OPTIONS.map((option) => (
              <Button
                key={option}
                onClick={() => handleGracePeriod(option)}
                label={`${convertToPersian(option)} ${getTranslation("772")}`}
                color="#3B3B3B"
                textColor="#949494"
                full
              />
            ))}
          </Days>
        ) : (
          <RemainedWrapper>
            <Remained>
              <TitleBody
                gray
                title={`${convertToPersian(day)} ${getTranslation("1413")}`}
              />
            </Remained>
          </RemainedWrapper>
        )}

        <Buttons>
          <Button
            full
            textColor="#FFFFFF"
            color={REJECT_COLOR}
            label={getTranslation("775")}
            explode={isExploding}
            explosionColor={REJECT_COLOR}
            onClick={handleReject}
          />
          <Button
            full
            textColor="#FFFFFF"
            color={ACCEPT_COLOR}
            label={getTranslation("776")}
            explode={isExplodingAccept}
            explosionColor={ACCEPT_COLOR}
            onClick={handleAccept}
          />
        </Buttons>
      </div>
    </Container>
  );
};

export default Proposer;