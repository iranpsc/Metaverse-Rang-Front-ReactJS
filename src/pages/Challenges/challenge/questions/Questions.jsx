import { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import blue from "../../../../assets/gif/blue-color.gif";
import psc from "../../../../assets/gif/psc.gif";
import red from "../../../../assets/gif/red-color.gif";
import rial from "../../../../assets/gif/rial.gif";
import yellow from "../../../../assets/gif/yellow-color.gif";
import nopic from "../../../../assets/images/nopic.jpg";
import useRequest from "../../../../hooks/useRequest.js";
import {
  convertToPersian,
  formatTime,
  getTranslation,
} from "../../../../services/Utility";
import {
  WalletContext,
  WalletContextTypes,
} from "../../../../services/reducers/WalletContext";
import Content from "./Content";
import Footer from "./Footer";

// نوع جایزه => آیکون و کلید آن در کیف پول
const PRIZES = {
  psc: { image: psc, walletKey: "psc" },
  rial: { image: rial, walletKey: "irr" },
  blue: { image: blue, walletKey: "blue" },
  red: { image: red, walletKey: "red" },
  yellow: { image: yellow, walletKey: "yellow" },
};

const RETURN_AFTER_ANSWER_MS = 14000;
const RETURN_AFTER_TIMEOUT_MS = 1000;

// فوتر ۰: پاسخ درست | ۱: پاسخ غلط
const countAnswer = (footers, isCorrect) =>
  footers.map((footer, index) =>
    index === (isCorrect ? 0 : 1)
      ? { ...footer, count: footer.count + 1 }
      : footer,
  );

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 8px;
  height: calc(100% - 100px);
  margin-top: 20px;
  padding: 0 10px;
  overflow-x: hidden;
  overflow-y: auto;

  img {
    width: 100%;
    border-radius: 10px;
  }

  @media (min-width: 500px) and (max-width: 1000px) {
    grid-template-columns: 1fr 170px;
    padding: 0 5px;
  }

  @media (min-width: 998px) {
    height: calc(100% - 130px);
  }

  @media (min-width: 1180px) {
    padding-right: 0;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 1fr;
    gap: 20px;
    height: calc(100% - 150px);
    padding-right: 15px;
  }
`;

const Sidebar = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: fit-content;
  min-width: 190px;

  @media (max-width: 1280px) {
    p {
      font-size: 13px;
      font-weight: 400;
    }

    span {
      font-size: 16px;
    }
  }

  @media (min-width: 500px) and (max-width: 1000px) {
    p,
    span {
      font-size: 13px;
    }
  }

  @media (min-width: 1280px) {
    position: static;
  }
`;

const Video = styled.video`
  display: block;
  width: 100%;
  height: auto;
  border-radius: 10px;
`;

const TimerBar = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 5px 15px;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};

  @media (max-width: 1280px) {
    display: flex;
  }
`;

const Time = styled.div`
  span {
    font-size: 20px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Prize = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;

  div {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  span {
    color: #949494;
  }

  img {
    width: 15px;
  }
`;

const Questions = ({
  organizers,
  setFirstPage,
  setFooters,
  setShining,
  questionTime,
  answerTime,
}) => {
  const { Request, HTTP_METHOD } = useRequest();
  const [wallet, dispatch] = useContext(WalletContext);

  const [timer, setTimer] = useState(questionTime);
  const [data, setData] = useState();
  const [answer, setAnswer] = useState();
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

  const main = organizers?.[0];
  const prize = PRIZES[data?.prize_type];
  const prizeImage = prize?.image ?? psc;
  const showAnswer = Boolean(answer);

  // دریافت سوال
  useEffect(() => {
    let cancelled = false;

    const fetchQuestion = async () => {
      try {
        const res = await Request("challenge/question");
        if (!cancelled) setData(res.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();

    return () => {
      cancelled = true;
    };
  }, []);

  // شمارش معکوس
  useEffect(() => {
    if (timer <= 0) return;

    const timeout = setTimeout(() => setTimer((prev) => prev - 1), 1000);

    return () => clearTimeout(timeout);
  }, [timer]);

  // پایان زمان: برگشت به صفحه‌ی اول
  useEffect(() => {
    if (timer !== 0) return;

    if (!selectedAnswerId) setShining(null);

    const timeout = setTimeout(
      () => setFirstPage(true),
      RETURN_AFTER_TIMEOUT_MS,
    );

    return () => clearTimeout(timeout);
  }, [timer, selectedAnswerId, setFirstPage, setShining]);

  // بعد از ثبت پاسخ، با تأخیر به صفحه‌ی اول برگرد
  useEffect(() => {
    if (!answer) return;

    const timeout = setTimeout(
      () => setFirstPage(true),
      RETURN_AFTER_ANSWER_MS,
    );

    return () => clearTimeout(timeout);
  }, [answer, setFirstPage]);

  const handleSelectAnswer = async (questionId, answerId) => {
    if (selectedAnswerId) return;

    setSelectedAnswerId(answerId);

    try {
      const res = await Request("challenge/answer", HTTP_METHOD.POST, {
        question_id: questionId,
        answer_id: answerId,
      });

      const isCorrect = Boolean(
        res.data.answers.find((item) => item.id === answerId)?.is_correct,
      );

      setAnswer(res.data);
      setTimer(answerTime);
      setShining(isCorrect);
      setFooters((prev) => countAnswer(prev, isCorrect));

      if (isCorrect && prize?.walletKey) {
        const { walletKey } = prize;

        dispatch({
          type: WalletContextTypes.ADD_WALLET,
          payload: {
            ...wallet,
            [walletKey]: (+wallet[walletKey] || 0) + data.prize,
          },
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const question = useMemo(
    () => ({
      title: data?.title,
      questionID: data?.id,
      options: (data?.answers ?? []).map((item) => {
        const result = answer?.answers?.find((a) => a.id === item.id);

        return {
          id: item.id,
          title: item.title,
          status: Boolean(result?.is_correct),
          percent: result?.vote_percentage ?? 0,
        };
      }),
    }),
    [data, answer],
  );

  return (
    <Container>
      <Body>
        <Sidebar>
          {main?.video_url ? (
            <Video src={main.video_url} autoPlay muted loop playsInline />
          ) : (
            <img loading="lazy" src={main?.image_url || nopic} alt="" />
          )}

          <TimerBar>
            <Time>
              <p>{getTranslation("1473")}</p>
              <span>{convertToPersian(formatTime(timer))}</span>
            </Time>
            <Prize>
              <p>{getTranslation("1474")}</p>
              <div>
                <span>{convertToPersian(data?.prize)}</span>
                <img
                  loading="lazy"
                  src={prizeImage}
                  alt=""
                  width={26}
                  height={26}
                />
              </div>
            </Prize>
          </TimerBar>
        </Sidebar>

        <Content
          question={question}
          showAnswer={showAnswer}
          selectedAnswerId={selectedAnswerId}
          onSelectAnswer={handleSelectAnswer}
        />
      </Body>

      <Footer data={data} />
    </Container>
  );
};

export default Questions;