import { useEffect, useState } from "react";
import styled from "styled-components";
import Container from "../../../../components/Common/Container";
import SearchInput from "../../../../components/SearchInput";
import PropertySkeleton from "../../../../components/Skeletons/PropertySkeleton.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { cleanSearchText, getTranslation } from "../../../../services/Utility";
import ResultCard from "./ResultCard";
import TitleHeader from "../../../../components/TitleHeader.jsx";
const SYSTEM_OWNER_CODE = "HM-2000000";

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
`;

const EmptyText = styled.p`
  margin-top: 20px;
  text-align: center;
`;

const SearchPropertyTab = () => {
  const { Request, HTTP_METHOD } = useRequest();

  const [searched, setSearched] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // محافظ دوم: حتی اگه value از جای دیگه ست شد، متن تمیز میشه
  const query = cleanSearchText(searched);

  // debounce داخل SearchInput انجام میشه، پس اینجا دوباره لازم نیست.
  // paste و Enter هم مقدار رو فوری میفرستن و همین effect جستجو رو اجرا می‌کنه.
  useEffect(() => {
    if (!query) {
      setData([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Request("search/features", HTTP_METHOD.POST, { searchTerm: query })
      .then((response) => {
        if (!cancelled) setData(response.data.data);
      })
      .catch((error) => {
        console.error("Error searching features:", error);
        if (!cancelled) setData([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const renderResults = () => {
    if (isLoading) return <PropertySkeleton />;
    if (data.length === 0)
      return (
        <EmptyText>
          <TitleHeader noMargin title={getTranslation("37")} />
        </EmptyText>
      );

    return (
      <Results>
        {data.map((item) => (
          <ResultCard
            key={item.id}
            item={item}
            system={item.owner_code === SYSTEM_OWNER_CODE}
          />
        ))}
      </Results>
    );
  };

  return (
    <Container>
      <SearchInput
        value={searched}
        placeholder={getTranslation("40")}
        onchange={(e) => setSearched(e.target.value)}
      />

      {renderResults()}
    </Container>
  );
};

export default SearchPropertyTab;
