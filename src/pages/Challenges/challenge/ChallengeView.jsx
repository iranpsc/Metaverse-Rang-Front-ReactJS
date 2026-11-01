import { useEffect, useState } from "react";
import useRequest from "../../../hooks/useRequest.js";
import { getTranslation } from "../../../services/Utility";
import falsep from "../../../assets/images/challenge/close-circle.svg";
import truep from "../../../assets/images/challenge/tick-circle.svg";
import users from "../../../assets/images/challenge/profile-2user.svg";
import view from "../../../assets/images/challenge/eye.svg";
import Organizers from "./organizers/Organizers";
import Questions from "./questions/Questions";

const buildFooters = (timings) => [
  {
    id: 1,
    icon: truep,
    count: timings?.correct_answers ?? 0,
    slug: getTranslation("1778"),
  },
  {
    id: 2,
    icon: falsep,
    count: timings?.wrong_answers ?? 0,
    slug: getTranslation("1777"),
  },
  {
    id: 3,
    icon: view,
    count: timings?.views ?? 0,
    slug: getTranslation("1775"),
  },
  {
    id: 4,
    icon: users,
    count: timings?.participants ?? 0,
    slug: getTranslation("1776"),
  },
];

const ChallengeView = () => {
  const { Request } = useRequest();

  const [organizers, setOrganizers] = useState(null);
  const [timings, setTimings] = useState(null);
  const [footers, setFooters] = useState([]);
  const [firstPage, setFirstPage] = useState(true);
  const [shining, setShining] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [organizersRes, timingsRes] = await Promise.all([
          Request("challenge/advertisement"),
          Request("challenge/timings"),
        ]);

        if (cancelled) return;

        const timingsData = timingsRes.data.data;

        setOrganizers(organizersRes.data.data);
        setTimings(timingsData);
        setFooters(buildFooters(timingsData));
      } catch (error) {
        console.error("Error fetching challenge data:", error);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!organizers) return null;

  return firstPage ? (
    <Organizers
      organizers={organizers}
      footers={footers}
      shining={shining}
      timings={timings?.display_ad_interval}
      setFirstPage={setFirstPage}
    />
  ) : (
    <Questions
      organizers={organizers}
      footers={footers}
      setFooters={setFooters}
      setFirstPage={setFirstPage}
      setShining={setShining}
      questionTime={timings?.display_question_interval}
      answerTime={timings?.display_answer_interval}
    />
  );
};

export default ChallengeView;
