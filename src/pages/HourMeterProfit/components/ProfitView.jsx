import { useEffect, useState, useCallback, useContext, useRef } from "react";
import Button from "./Button";
import ProfitList from "./ProfitList";
import building from "../../../assets/images/building.png";
import education from "../../../assets/images/courthouse.png";
import house from "../../../assets/images/house.png";
import styled from "styled-components";
import useRequest from "../../../services/Hooks/useRequest";
import { getTranslation } from "../../../services/Utility";
import { UserContextTypes } from "../../../services/actions/UserContextAction";

import { UserContext } from "../../../services/reducers/UserContext";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../services/reducers/WalletContext";
import Container from "../../../components/Common/Container";

const Buttons = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const ProfitView = () => {
  const [user, userDispatch] = useContext(UserContext);
  const [buttons, setButtons] = useState([]);
  const [cards, setCards] = useState([]);
  const { Request, HTTP_METHOD } = useRequest();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [wallet, dispatch] = useContext(WalletContext);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef(null);

  const karbariMapping = {
    m: {
      title: getTranslation("477"),
      logo: house,
      color: "#FFC700",
      background: "#ffc80021",
    },
    t: {
      title: getTranslation("475"),
      logo: building,
      color: "#FF0000",
      background: "#ff000021",
    },
    a: {
      title: getTranslation("476"),
      logo: education,
      color: "#0066FF",
      background: "#0066ff21",
    },
  };

  const fetchData = useCallback(async () => {
    if (!hasMore || fetchingRef.current) return;

    fetchingRef.current = true;

    try {
      const { data } = await Request(
        `hourly-profits?page=${page}`,
        HTTP_METHOD.GET,
      );

      const filteredData = data.data
        .filter((item) => item.is_active)
        .map((item) => ({
          ...item,
          ...karbariMapping[item.karbari],
        }));

      setCards((prev) => {
        const existingIds = new Set(prev.map((card) => String(card.id)));

        const uniqueCards = filteredData.filter(
          (card) => !existingIds.has(String(card.id)),
        );

        return [...prev, ...uniqueCards];
      });

      setHasMore(Boolean(data.links.next));

      setPage((prev) => prev + 1);

      setButtons((prev) =>
        prev.length
          ? prev
          : [
              {
                id: 1,
                title: getTranslation("28"),
                logo: building,
                value: +data.additional.total_tejari_profit,
                color: "#FF0000",
              },
              {
                id: 2,
                title: getTranslation("29"),
                logo: house,
                value: +data.additional.total_maskoni_profit,
                color: "#FFC700",
              },
              {
                id: 3,
                title: getTranslation("474"),
                logo: education,
                value: +data.additional.total_amozeshi_profit,
                color: "#0066FF",
              },
            ],
      );
    } catch (err) {
      console.error(err);
    } finally {
      fetchingRef.current = false;
    }
  }, [page, hasMore, Request, HTTP_METHOD]);

  // Infinite scroll: whenever the sentinel at the end of the list is visible,
  // load the next page. This also handles the first load and short lists.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) fetchData();
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchData, hasMore, cards.length]);

  const sumHandler = ({ color }) => {
    const sameColorCards = cards.filter((card) => card.color === color);

    const totalValue = buttons.find((btn) => btn.color === color)?.value ?? 0;

    const cardsAreZero = sameColorCards.every((item) => item.value === 0);

    const allValuesAreZero = cardsAreZero && totalValue === 0;

    if (!allValuesAreZero) {
      const karbari = Object.entries(karbariMapping).find(
        ([, value]) => value.color === color,
      )?.[0];

      Request(`hourly-profits`, HTTP_METHOD.POST, { karbari })
        .then(() => {
          setButtons((prevButtons) =>
            prevButtons.map((button) =>
              button.color === color ? { ...button, value: 0 } : button,
            ),
          );

          setCards((prevCards) =>
            prevCards.filter((card) => card.color !== color),
          );

          const updatedWallet = {
            ...wallet,
            yellow:
              color === "#FFC700"
                ? (+wallet.yellow || 0) + totalValue
                : wallet.yellow,
            red:
              color === "#FF0000"
                ? (+wallet.red || 0) + totalValue
                : wallet.red,
            blue:
              color === "#0066FF"
                ? (+wallet.blue || 0) + totalValue
                : wallet.blue,
          };

          dispatch({
            type: WalletContextTypes.ADD_WALLET,
            payload: updatedWallet,
          });

          userDispatch({
            type: UserContextTypes.UPDATE_FIELD,
            payload: {
              key: "hourly_profit_time_percentage",
              value:
                totalValue === 0
                  ? 0
                  : Math.max(
                      0,
                      (user?.hourly_profit_time_percentage ?? 0) -
                        totalValue * 100,
                    ),
            },
          });
        })
        .catch(console.error);
    }
  };

  const handelClick = ({ color, amount, id }) => {
    const numericAmount = +amount;

    Request(`hourly-profits/${id}`, HTTP_METHOD.POST)
      .then(() => {
        setButtons((prevButtons) =>
          prevButtons.map((button) =>
            button.color === color
              ? { ...button, value: button.value - numericAmount }
              : button,
          ),
        );

        setCards((prevCards) =>
          prevCards.filter((card) => String(card.id) !== String(id)),
        );

        const updatedWallet = {
          ...wallet,
          yellow:
            color === "#FFC700"
              ? (+wallet.yellow || 0) + numericAmount
              : wallet.yellow,
          red:
            color === "#FF0000"
              ? (+wallet.red || 0) + numericAmount
              : wallet.red,
          blue:
            color === "#0066FF"
              ? (+wallet.blue || 0) + numericAmount
              : wallet.blue,
        };

        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: updatedWallet,
        });

        userDispatch({
          type: UserContextTypes.UPDATE_FIELD,
          payload: {
            key: "hourly_profit_time_percentage",
            value: Math.max(
              0,
              (+user.hourly_profit_time_percentage || 0) - numericAmount,
            ),
          },
        });
      })
      .catch(console.error);
  };

  return (
    <Container>
      <Buttons>
        {buttons.map((button) => (
          <Button
            onClick={() => sumHandler(button)}
            key={button.id}
            {...button}
          />
        ))}
      </Buttons>

      <ProfitList cards={cards} onClick={handelClick} />

      <div ref={sentinelRef} style={{ height: 1 }} />
    </Container>
  );
};

export default ProfitView;
