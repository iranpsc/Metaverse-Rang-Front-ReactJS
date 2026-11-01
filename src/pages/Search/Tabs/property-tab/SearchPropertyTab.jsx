import { useEffect, useState } from "react";
import styled from "styled-components";
import Container from "../../../../components/Common/Container";
import SearchInput from "../../../../components/SearchInput";
import PropertySkeleton from "../../../../components/Skeletons/PropertySkeleton.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import ResultCard from "./ResultCard";

const DEBOUNCE_MS = 500;
const SYSTEM_OWNER_CODE = "HM-2000000";

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
`;

const EmptyText = styled.p`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.newColors.shades[30]};
`;

const SearchPropertyTab = () => {
  const { Request, HTTP_METHOD } = useRequest();

  const [searched, setSearched] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const query = searched.trim();

  const search = async (term, isCancelled = () => false) => {
    setIsLoading(true);

    try {
      const response = await Request("search/features", HTTP_METHOD.POST, {
        searchTerm: term,
      });

      if (!isCancelled()) setData(response.data.data);
    } catch (error) {
      console.error("Error searching features:", error);
      if (!isCancelled()) setData([]);
    } finally {
      if (!isCancelled()) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!query) {
      setData([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(
      () => search(query, () => cancelled),
      DEBOUNCE_MS,
    );

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query]);

  const renderResults = () => {
    if (isLoading) return <PropertySkeleton />;
    if (data.length === 0) return <EmptyText>{getTranslation("37")}</EmptyText>;

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
        onSearch={() => query && search(query)}
      />

      {renderResults()}
    </Container>
  );
};

export default SearchPropertyTab;
