import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";

import {
  convertToPersian,
  getTranslation,
  ToastSuccess,
} from "../../../../services/Utility";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../services/reducers/WalletContext";
import Button from "../../../../components/Button";
import TitleBody from "../../../../components/TitleBody.jsx";
import { useTheme } from "../../../../hooks/useTheme.js";
import useRequest from "../../../../hooks/useRequest.js";
import { useMapData } from "../../../../hooks/useMapData.js";
import clocklight from "../../../../assets/gif/clocklight.gif";
import clockdark from "../../../../assets/gif/clockdark.gif";

/* ---------- Styles ---------- */

const Card = styled.div`
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.bgContainer};
`;

const Svg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 70px;
  max-height: 80px;
  overflow: hidden;

  img {
    display: block;
    width: auto;
    height: 100%;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  gap: 20px;
  width: 100%;

  @media screen and (max-width: 1500px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }
`;

const Timer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const TimeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 38px;
`;

const Value = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Unit = styled.span`
  margin-top: 2px;
  font-size: 10px;
  color: #777;
`;

const Colon = styled(Value)`
  margin: 0 6px;
`;

/* ---------- Helpers ---------- */

const EMPTY_TIME = { days: 0, hours: 0, minutes: 0, seconds: 0 };

// ترتیب نمایش: ثانیه ← دقیقه ← ساعت ← روز
const TIME_UNITS = [
  { key: "seconds", labelId: "778" },
  { key: "minutes", labelId: "33" },
  { key: "hours", labelId: "560" },
  { key: "days", labelId: "380" },
];

const calculateTimeLeft = (endDate) => {
  const diff = Math.floor((new Date(endDate).getTime() - Date.now()) / 1000);
  if (!(diff > 0)) return EMPTY_TIME; // پوشش NaN هم

  return {
    days: Math.floor(diff / 86400),
    hours: Math.floor((diff % 86400) / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
  };
};

/* ---------- Component ---------- */

const SatisfyCount = ({ isOwner }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { Request, HTTP_METHOD, checkSecurity } = useRequest();
  const { buildings, removeBuilding } = useMapData();
  const [wallet, dispatch] = useContext(WalletContext);
  const [timeLeft, setTimeLeft] = useState(EMPTY_TIME);

  const activeBuilding = useMemo(
    () => buildings.find((b) => b?.building?.feature_id === Number(id)) ?? null,
    [buildings, id],
  );

  const endDate = activeBuilding?.building?.construction_end_date;
  const featureId = activeBuilding?.building?.feature_id;
  const buildingId = activeBuilding?.model_id;
  const launchedSatisfaction =
    Number(activeBuilding?.building?.launched_satisfaction) || 0;

  useEffect(() => {
    if (!endDate) return;

    const tick = () => setTimeLeft(calculateTimeLeft(endDate));
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

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
          ...wallet,
          satisfaction: (Number(wallet.satisfaction) || 0) + launchedSatisfaction,
        },
      });
      removeBuilding(buildingId);
    } catch (error) {
      console.error("❌ Delete building error:", error);
    }
  };

  return (
    <Card>
      <Svg>
        <img src={theme === "light" ? clocklight : clockdark} alt="clock" />
      </Svg>

      <Main>
        <Header>
          <TitleBody noWrap title={getTranslation("1610")} />
          {isOwner && timeLeft.days > 0 && (
            <Button
              large
              color="#ff0000"
              label={getTranslation("1594")}
              onClick={handleDeleteBuilding}
            />
          )}
        </Header>

        <Timer>
          {TIME_UNITS.map(({ key, labelId }, index) => (
            <Fragment key={key}>
              {index > 0 && <Colon>:</Colon>}
              <TimeBox>
                <Value>{convertToPersian(timeLeft[key])}</Value>
                <Unit>{getTranslation(labelId)}</Unit>
              </TimeBox>
            </Fragment>
          ))}
        </Timer>
      </Main>
    </Card>
  );
};

export default SatisfyCount;