import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ConfettiExplosion from "react-confetti-explosion";
import styled from "styled-components";
import building from "../../../assets/images/building.png";
import education from "../../../assets/images/courthouse.png";
import house from "../../../assets/images/house.png";
import Container from "../../../components/Common/Container";
import useRequest from "../../../hooks/useRequest.js";
import { UserContextTypes } from "../../../services/actions/UserContextAction";
import { UserContext } from "../../../services/reducers/UserContext";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../services/reducers/WalletContext";
import { getTranslation } from "../../../services/Utility";
import Button from "./Button";
import ProfitList from "./ProfitList";

// کاربری => عنوان، آیکون، رنگ و کلید آن در کیف پول
const KARBARI = {
  m: {
    titleId: "477",
    logo: house,
    color: "#FFC700",
    background: "#ffc80021",
    walletKey: "yellow",
  },
  t: {
    titleId: "475",
    logo: building,
    color: "#FF0000",
    background: "#ff000021",
    walletKey: "red",
  },
  a: {
    titleId: "476",
    logo: education,
    color: "#0066FF",
    background: "#0066ff21",
    walletKey: "blue",
  },
};

// رنگ => کلید کاربری و تنظیمات آن
const KARBARI_BY_COLOR = Object.fromEntries(
  Object.entries(KARBARI).map(([key, value]) => [
    value.color,
    { key, ...value },
  ]),
);

// دکمه‌های جمع کل (ترتیب نمایش مهم است)
const SUMMARY_BUTTONS = [
  {
    id: 1,
    titleId: "28",
    logo: building,
    karbari: "t",
    field: "total_tejari_profit",
  },
  {
    id: 2,
    titleId: "29",
    logo: house,
    karbari: "m",
    field: "total_maskoni_profit",
  },
  {
    id: 3,
    titleId: "474",
    logo: education,
    karbari: "a",
    field: "total_amozeshi_profit",
  },
];

const PERCENT_PER_PROFIT_UNIT = 100;

const buildTotals = (additional) =>
  Object.fromEntries(
    SUMMARY_BUTTONS.map(({ karbari, field }) => [
      KARBARI[karbari].color,
      Number(additional?.[field]) || 0,
    ]),
  );

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const Sentinel = styled.div`
  height: 1px;
`;

const ConfettiAnchor = styled.div`
  position: fixed;
  z-index: 1000;
  width: 0;
  height: 0;
  pointer-events: none;
`;

const ProfitView = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const [user, userDispatch] = useContext(UserContext);
  const [wallet, walletDispatch] = useContext(WalletContext);

  const [cards, setCards] = useState([]);
  const [totals, setTotals] = useState(null); // { [color]: مجموع سود }
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [confettiOrigin, setConfettiOrigin] = useState(null);

  const fetchingRef = useRef(false);
  const claimingRef = useRef(false);
  const sentinelRef = useRef(null);

  const buttons = totals
    ? SUMMARY_BUTTONS.map(({ id, titleId, logo, karbari }) => {
        const { color } = KARBARI[karbari];
        return {
          id,
          title: getTranslation(titleId),
          logo,
          color,
          value: totals[color],
        };
      })
    : [];

  const fetchData = useCallback(async () => {
    if (!hasMore || fetchingRef.current) return;

    fetchingRef.current = true;

    try {
      const { data } = await Request(
        `hourly-profits?page=${page}`,
        HTTP_METHOD.GET,
      );
      const activeCards = data.data
        .filter((item) => item.is_active)
        .map((item) => {
          const { titleId, logo, color, background } =
            KARBARI[item.karbari] ?? {};

          return {
            ...item,
            title: titleId ? getTranslation(titleId) : item.title,
            logo,
            color,
            background,
          };
        });

      setCards((prev) => {
        const existingIds = new Set(prev.map((card) => String(card.id)));

        return [
          ...prev,
          ...activeCards.filter((card) => !existingIds.has(String(card.id))),
        ];
      });

      // مجموع‌ها فقط از صفحه‌ی اول گرفته می‌شوند
      setTotals((prev) => prev ?? buildTotals(data.additional));
      setHasMore(Boolean(data.links.next));
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching hourly profits:", error);
    } finally {
      fetchingRef.current = false;
    }
  }, [page, hasMore, Request, HTTP_METHOD]);

  // اسکرول بی‌نهایت: هر وقت sentinel انتهای لیست دیده شد، صفحه‌ی بعد لود می‌شود
  // (لود اولیه و لیست‌های کوتاه هم همین‌جا پوشش داده می‌شوند)
  useEffect(() => {
    const element = sentinelRef.current;
    if (!element || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchData();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [fetchData, hasMore, cards.length]);

  const creditWallet = (color, amount) => {
    const walletKey = KARBARI_BY_COLOR[color]?.walletKey;
    if (!walletKey || amount <= 0) return;

    walletDispatch({
      type: WalletContextTypes.ADD_WALLET,
      payload: { ...wallet, [walletKey]: (+wallet[walletKey] || 0) + amount },
    });
  };

  const setHourlyPercentage = (value) =>
    userDispatch({
      type: UserContextTypes.UPDATE_FIELD,
      payload: { key: "hourly_profit_time_percentage", value },
    });

  const currentPercentage = +user?.hourly_profit_time_percentage || 0;

  const triggerSuccessAnimation = (color, rect) => {
    setConfettiOrigin({
      color,
      x: rect ? rect.left + rect.width / 2 : window.innerWidth / 2,
      y: rect ? rect.top + rect.height / 2 : window.innerHeight / 2,
      key: Date.now(),
    });
  };

  const handleClaimAll = async (color, rect) => {
    const karbari = KARBARI_BY_COLOR[color]?.key;
    const total = Number(totals?.[color]) || 0;
    if (claimingRef.current || !karbari || total <= 0) return false;

    claimingRef.current = true;
    setClaiming(true);
    try {
      await Request("hourly-profits", HTTP_METHOD.POST, {
        karbari,
      });

      setTotals((prev) => ({ ...prev, [color]: 0 }));
      setCards((prev) => prev.filter((card) => card.color !== color));

      creditWallet(color, total);
      setHourlyPercentage(
        Math.max(
          0,
          currentPercentage - total * PERCENT_PER_PROFIT_UNIT,
        ),
      );
      triggerSuccessAnimation(color, rect);
      return true;
    } catch (error) {
      console.error("Error claiming all profits:", error);
      return false;
    } finally {
      claimingRef.current = false;
      setClaiming(false);
    }
  };

  const handleClaim = async ({ color, amount, id }, rect) => {
    const numericAmount = Number(amount);
    if (
      claimingRef.current ||
      !KARBARI_BY_COLOR[color] ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return false;
    }

    claimingRef.current = true;
    setClaiming(true);
    try {
      await Request(`hourly-profits/${id}`, HTTP_METHOD.POST);

      setTotals((prev) => ({
        ...prev,
        [color]: Math.max(0, (Number(prev?.[color]) || 0) - numericAmount),
      }));
      setCards((prev) => prev.filter((card) => String(card.id) !== String(id)));

      creditWallet(color, numericAmount);
      setHourlyPercentage(
        Math.max(
          0,
          currentPercentage - numericAmount * PERCENT_PER_PROFIT_UNIT,
        ),
      );
      triggerSuccessAnimation(color, rect);
      return true;
    } catch (error) {
      console.error("Error claiming profit:", error);
      return false;
    } finally {
      claimingRef.current = false;
      setClaiming(false);
    }
  };

  return (
    <Container>
      <Buttons>
        {buttons.map((button) => (
          <Button
            key={button.id}
            {...button}
            disabled={claiming || Number(button.value) <= 0}
            onClick={(event) =>
              handleClaimAll(
                button.color,
                event.currentTarget.getBoundingClientRect(),
              )
            }
          />
        ))}
      </Buttons>

      <ProfitList
        cards={cards}
        disabled={claiming}
        onClick={handleClaim}
      />
      {/**لود بیشتر ایتم ها  */}
      <Sentinel ref={sentinelRef} />
      {confettiOrigin &&
        createPortal(
          <ConfettiAnchor
            style={{
              left: confettiOrigin.x,
              top: confettiOrigin.y,
            }}
          >
            <ConfettiExplosion
              key={confettiOrigin.key}
              particleSize={5}
              width={400}
              height="80vh"
              zIndex={1000}
              colors={[confettiOrigin.color]}
              onComplete={() => setConfettiOrigin(null)}
            />
          </ConfettiAnchor>,
          document.body,
        )}
    </Container>
  );
};

export default ProfitView;
