import styled from "styled-components";
import {
  convertToPersian,
  getTranslation,
  ToastSuccess,
} from "../../../../services/Utility";
import Button from "../../../../components/Button";
import clocklight from "../../../../assets/gif/clocklight.gif";
import clockdark from "../../../../assets/gif/clockdark.gif";
import { useTheme } from "../../../../hooks/useTheme.js";
import useRequest from "../../../../hooks/useRequest.js";
import { useMapData } from "../../../../hooks/useMapData.js";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import { useEffect, useState, useContext } from "react";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../services/reducers/WalletContext";
const Card = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-self: center;
  justify-content: center;
  gap: 20px;
  @media screen and (max-width: 1500px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }
`;

const Title = styled.div`
  font-weight: 500;
  display: flex;
  padding: 0 15px;
  align-items: center;
  white-space: nowrap;
  color: ${(props) => props.theme.colors.newColors.shades.title};
`;

const Main = styled.div`
  display: flex;
  width: 100%;

  height: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  div {
  }
`;
const Svg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 70px;
  max-height: 80px;
  overflow: hidden;

  & img {
    display: block;
    width: auto;
    height: 100%;
  }
`;

const Timer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const TimeBox = styled.div`
  display: flex;
  width: 100%;

  flex-direction: column;
  align-items: center;
  min-width: 38px;
`;

const Value = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

const Unit = styled.span`
  font-size: 10px;
  color: #777;
  margin-top: 2px;
`;

const Colon = styled.span`
  margin: 0 6px;
  font-size: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
`;

const SatisfyCount = ({ isOwner }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [Wallet, dispatch] = useContext(WalletContext);
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const { buildings, removeBuilding } = useMapData();
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const activeBuilding =
    buildings.find((b) => b?.building?.feature_id === parseInt(id)) || null;
  const launchedSatisfaction = activeBuilding?.building?.launched_satisfaction;

  const featureId = activeBuilding?.building?.feature_id;
  const buildingId = activeBuilding?.model_id;
  const base = Number(Wallet.satisfaction) || 0;
  const extra = Number(launchedSatisfaction) || 0;
  const total = base + extra;
  const calculateTimeLeft = (endDate) => {
    const endTime = new Date(endDate).getTime();
    const now = Date.now();
    let diff = Math.floor((endTime - now) / 1000);

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(diff / 86400);
    diff %= 86400;

    const hours = Math.floor(diff / 3600);
    diff %= 3600;

    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    if (!activeBuilding?.building?.construction_end_date) return;

    setTimeLeft(
      calculateTimeLeft(activeBuilding.building?.construction_end_date),
    );

    const interval = setInterval(() => {
      setTimeLeft(
        calculateTimeLeft(activeBuilding.building?.construction_end_date),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBuilding?.building?.construction_end_date]);

  const handleDeleteBuilding = async () => {
    if (!checkSecurity()) return;

    try {
      await Request(
        `features/${featureId}/build/buildings/${buildingId}`,
        HTTP_METHOD.DELETE,
      );

      ToastSuccess(getTranslation("1609"));
      navigate("");
      dispatch({
        type: WalletContextTypes.ADD_WALLET,
        payload: {
          ...Wallet,
          satisfaction: total,
        },
      });
      removeBuilding(activeBuilding.model_id);
    } catch (error) {
      console.error("❌ Delete building error:", error);
    }
  };
  const clockIcon = theme == "light" ? clocklight : clockdark;
  return (
    <Card>
      {" "}
      <Svg>
        <img src={clockIcon} alt="clock" />
      </Svg>
      <Main>
        <Header>
          <Title>{getTranslation("1610")}</Title>
          {isOwner && timeLeft.days > 0 && (
            <Button
              large
              color={"#ff0000"}
              label={getTranslation("1594")}
              onClick={handleDeleteBuilding}
            />
          )}
        </Header>

        <Timer>
          <TimeBox>
            <Value>{convertToPersian(timeLeft.seconds)}</Value>
            <Unit>{getTranslation("778")}</Unit>
          </TimeBox>

          <Colon>:</Colon>

          <TimeBox>
            <Value>{convertToPersian(timeLeft.minutes)}</Value>
            <Unit>{getTranslation("33")}</Unit>
          </TimeBox>

          <Colon>:</Colon>

          <TimeBox>
            <Value>{convertToPersian(timeLeft.hours)}</Value>
            <Unit>{getTranslation("560")}</Unit>
          </TimeBox>

          <Colon>:</Colon>

          <TimeBox>
            <Value>{convertToPersian(timeLeft.days)}</Value>
            <Unit>{getTranslation("380")}</Unit>
          </TimeBox>
        </Timer>
      </Main>
    </Card>
  );
};

export default SatisfyCount;
