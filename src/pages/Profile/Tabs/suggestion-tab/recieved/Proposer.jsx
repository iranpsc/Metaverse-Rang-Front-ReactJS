// Proposer.jsx
import Button from "../../../../../components/Button";
import ConfettiExplosion from "react-confetti-explosion";
import { MdOutlineKeyboardArrowUp } from "react-icons/md";
import {
  convertToPersian,
  getTranslation,
  SanitizeHTML,
  ToastError,
  metarangUrlCitizen,
  pscToIrr,
  formatNumber,
} from "../../../../../services/Utility/index";
import line from "../../../../../assets/images/profile/Line.png";
import pscpng from "../../../../../assets/images/profile/psc.gif";
import rialpng from "../../../../../assets/images/profile/rial.gif";
import styled from "styled-components";
import { useState, useContext } from "react";
import moment from "moment-jalaali";
import { useLanguage } from "../../../../../services/reducers/LanguageContext";
import {
  Info,
  proposerContainer,
  BasePrice,
  Prices,
  RejectButton,
  Text,
} from "../suggestionStyles";
import useRequest from "../../../../../services/Hooks/useRequest/index";
import DefaultProfile from "../../../../../assets/images/defulte-profile.png";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../../services/reducers/WalletContext";
const Price = BasePrice;
const ProposalStatus = styled.div``;

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
  & img {
    border-radius: 100%;
  }
  p {
    color: #a0a0ab;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 5px;
  }
  a {
    text-decoration: none;
    color: #0066ff;
  }
`;
const Time = styled.div`
  p {
    color: #a0a0ab;
    font-size: 14px;
    font-weight: 600;
  }
  h3 {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 18px;
    font-weight: 500;
    margin-top: 4px;
  }
`;
const Container = proposerContainer;

const Days = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  button {
    background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.iconBg};
    white-space: nowrap;
    font-size: 16px;
    padding: 8px;
    font-weight: 600;
  }
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

const Div = styled.div`
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
  color: #949494;
  font-size: 16px;
  font-weight: 400;
`;
const StyledArrowUp = styled(MdOutlineKeyboardArrowUp)`
  color: ${({ percent }) => (percent > 0 ? "#18C08F" : "#FF0000")};
  rotate: ${({ percent }) => (percent > 0 ? "" : "180deg")};
`;

const getGraceRemainingDays = (gracePeriod) => {
  if (!gracePeriod) return 0;
  const remaining = Math.ceil(
    (moment(gracePeriod, "jYYYY/jMM/jDD HH:mm:ss").toDate() - new Date()) /
    (1000 * 60 * 60 * 24),
  );
  return remaining <= 0 ? 0 : remaining;
};

const Proposer = ({ item, onRemoved }) => {
  const [day, setDay] = useState(() =>
    getGraceRemainingDays(item.requested_grace_period),
  );
  const [Wallet, dispatch] = useContext(WalletContext);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [isExplodingAccept, setIsExplodingAccept] = useState(false);

  const isPersian = useLanguage();
  const { Request, checkSecurity } = useRequest();
  const calculatePercentDiff = (item) => {
    const baseIrr = +item.price_irr || 0;
    const basePsc = pscToIrr(item.price_psc);
    const suggestedIrr = +item.feature_properties?.price_irr;
    const suggestedPsc = pscToIrr(item.feature_properties?.price_psc);
    const baseTotal = baseIrr + basePsc;
    const suggestedTotal = suggestedIrr + suggestedPsc;

    if (!baseTotal) return 0;

    return ((suggestedTotal - baseTotal) / baseTotal) * 100;
  };

  const information = item.note || "";
  const percent = calculatePercentDiff(item);

  const handleGracePeriod = async (selectedDay) => {
    if (!item?.id) {
      console.error("Error: id is undefined!");
      return;
    }
    try {
      if (!checkSecurity()) return;

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
    } catch (error) {
      ToastError(error?.response?.data?.message);
    }
  };

  const handleReject = async () => {
    try {
      if (!checkSecurity()) return;
      const response = await Request(`buy-requests/reject/${item.id}`, "POST");

      if ([200, 204].includes(response.status)) {
        setIsExploding(true);
        setTimeout(() => onRemoved?.(), 300);
      }
    } catch (error) {
      ToastError(error?.response?.data?.message);
    }
  };

  const handleAccept = async () => {
    try {
      if (!checkSecurity()) return;
      const response = await Request(`buy-requests/accept/${item.id}`, "POST");

      if ([200, 204].includes(response.status)) {
        setIsExplodingAccept(true);
        setTimeout(() => onRemoved?.(), 100);

        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: {
            ...Wallet,
            irr: Wallet.irr + +item.feature_properties.price_irr,
            psc: Wallet.psc + +item.feature_properties.price_psc
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
        <Header>
          <Person>
            <img
              src={item.buyer?.profile_photo || DefaultProfile}
              alt={item.buyer?.code}
              width={60}
              height={60}
              onError={(e) => {
                e.target.src = DefaultProfile;
              }}
            />
            <div>
              <p>{getTranslation("768")}</p>
              <a target="blank" href={metarangUrlCitizen(item.buyer?.code)}>
                {item.buyer?.code?.toUpperCase?.()}
              </a>
            </div>
          </Person>
          <Time>
            <div>
              <p>{getTranslation("769")}</p>
              <h3>{convertToPersian(item.created_at)}</h3>
            </div>
          </Time>
        </Header>
        <Price percent={percent}>
          <h3>{getTranslation("773")}</h3>
          <Prices percent={percent}>
            <div>
              <img width={24} height={24} src={rialpng} />
              <span>
                {convertToPersian(
                  formatNumber(item.feature_properties.price_irr),
                )}
              </span>
            </div>
            <img width={1} height={24} src={line} />
            <div>
              <img width={24} height={24} src={pscpng} />
              <span>
                {convertToPersian(
                  formatNumber(item.feature_properties.price_psc),
                )}
              </span>
            </div>
            <img width={1} height={24} src={line} />
            <div>
              <StyledArrowUp percent={percent} />
              <h3>{convertToPersian(formatNumber(Math.abs(percent)))}%</h3>
            </div>
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
        {day === 0 && (
          <Days>
            <Button
              onClick={() => handleGracePeriod(7)}
              label={`${convertToPersian(7)} ${getTranslation("772")} `}
              color="#3B3B3B"
              textColor="#949494"
              full
            />
            <Button
              onClick={() => handleGracePeriod(1)}
              label={`${convertToPersian(1)} ${getTranslation("772")} `}
              color="#3B3B3B"
              textColor="#949494"
              full
            />
          </Days>
        )}
        {day !== 0 && (
          <Div>
            <Remained>
              {convertToPersian(day)} {getTranslation("1413")}
            </Remained>
          </Div>
        )}
        <Buttons>
          <RejectButton onClick={handleReject}>
            {getTranslation("775")}
            {isExploding && (
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
            )}
          </RejectButton>
          <div style={{ position: "relative" }}>
            <Button
              label={getTranslation("776")}
              color="#18C08F"
              textColor="#FFFFFF"
              onClick={handleAccept}
              full
            />
            {isExplodingAccept && (
              <ConfettiExplosion
                zIndex={9999}
                particleCount={150}
                duration={3000}
                colors={["#18C08F"]}
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
            )}
          </div>
        </Buttons>
      </ProposalStatus>
    </Container>
  );
};

export default Proposer;
