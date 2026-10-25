import { useEffect, useState } from "react";
import Organizers from "./organizers/Organizers";
import Questions from "./questions/Questions";
import useRequest from "../../../hooks/useRequest.js";
import { getTranslation } from "../../../services/Utility";
import falsep from "../../../assets/images/challenge/close-circle.svg";
import truep from "../../../assets/images/challenge/tick-circle.svg";
import users from "../../../assets/images/challenge/profile-2user.svg";
import view from "../../../assets/images/challenge/eye.svg";

const ChallengeView = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const [organizers, setOrganizers] = useState(null);
  const [footers, setFooters] = useState([]);
  const [firstPage, setFirstPage] = useState(true);
  const [shining, setShining] = useState(null);
  const [timings, setTimings] = useState(null);
  useEffect(() => {
    setShining(null)
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [organizersRes, timingsRes] = await Promise.all([
          Request("challenge/advertisement", HTTP_METHOD.GET),
          Request("challenge/timings", HTTP_METHOD.GET),
        ]);
        setOrganizers(organizersRes.data.data);
        const timings = timingsRes.data.data;

        setTimings(timings);
        setFooters([
          {
            id: 1,
            icon: truep,
            count: timings?.correct_answers ?? 0,
            slug: getTranslation(1778),
          },
          {
            id: 2,
            icon: falsep,
            count: timings?.wrong_answers ?? 0,
            slug: getTranslation(1777),
          },
          {
            id: 3,
            icon: view,
            count: timings?.views ?? 0,
            slug: getTranslation(1775),
          },
          {
            id: 4,
            icon: users,
            count: timings?.participants ?? 0,
            slug: getTranslation(1776),
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (!organizers) return null;
  return firstPage ? (
    <Organizers
      footers={footers}
      organizers={organizers}
      setFirstPage={setFirstPage}
      shining={shining}
      timings={timings?.display_ad_interval}
    />
  ) : (
    <Questions
      organizers={organizers}
      setFooters={setFooters}
      footers={footers}
      setFirstPage={setFirstPage}
      setShining={setShining}
      questionTime={timings?.display_question_interval}
      answerTime={timings?.display_answer_interval}
    />
  );
};

export default ChallengeView;
