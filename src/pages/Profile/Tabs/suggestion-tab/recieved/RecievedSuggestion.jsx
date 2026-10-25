// RecievedSuggestion.jsx
import Suggestion from "./Suggestion";
import Title from "../../../../../components/Title";
import { useState, useEffect, useRef } from "react";
import { Wrapper } from "../suggestionStyles";
import useRequest from "../../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../../services/Utility/index";
import Container from "../../../../../components/Common/Container";

const RecievedSuggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Request } = useRequest();
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const response = await Request("buy-requests/recieved", "GET");
        const data = response?.data?.data;

        if (!Array.isArray(data)) {
          console.error("Invalid data format from API:", response?.data);
          return;
        }

        if (isMounted) {
          setSuggestions(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSuggestions();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Container ref={containerRef}>
        <Title right title={getTranslation("764")} />
        <Wrapper>
          {Array.from({ length: 3 }).map((_, index) => (
            <Suggestion key={index} isLoading={true} />
          ))}
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container ref={containerRef}>
      <Title right title={getTranslation("764")} />
      <Wrapper>
        {suggestions.map((item) => (
          <Suggestion key={item.id} item={item} isLoading={false} />
        ))}
      </Wrapper>
    </Container>
  );
};

export default RecievedSuggestion;