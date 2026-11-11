// لیست پیشنهادهای خرید (دریافتی/ارسالی)؛ مناسب تب پیشنهادها، کارت مناسب هر نوع را با اسکلت لودینگ نشان می‌دهد
import { useState, useEffect } from "react";
import ReceivedSuggestion from "./recieved/Suggestion";
import SentSuggestion from "./sent/Suggestion";
import { Wrapper } from "./suggestionStyles";
import TitleHeader from "../../../../components/TitleHeader";
import Container from "../../../../components/Common/Container";
import SuggestionsSkeleton from "../../../../components/Skeletons/SuggestionsSkeleton";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility/index";

const TYPES = {
  recieved: {
    endpoint: "buy-requests/recieved",
    title: "764",
    Card: ReceivedSuggestion,
    skeleton: "received",
  },
  sent: {
    endpoint: "buy-requests",
    title: "765",
    Card: SentSuggestion,
    skeleton: "sent",
  },
};

const SuggestionList = ({ type }) => {
  const { endpoint, title, Card, skeleton } = TYPES[type];
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Request } = useRequest();

  useEffect(() => {
    let isMounted = true;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await Request(endpoint, "GET");
        const data = response?.data?.data;

        if (!Array.isArray(data)) {
          console.error("Invalid data format from API:", response?.data);
          return;
        }

        if (isMounted) setSuggestions(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return (
    <Container>
      <TitleHeader right title={getTranslation(title)} />
      <Wrapper>
        {loading ? (
          <SuggestionsSkeleton variant={skeleton} />
        ) : (
          suggestions.map((item) => <Card key={item.id} item={item} />)
        )}
      </Wrapper>
    </Container>
  );
};

export default SuggestionList;
