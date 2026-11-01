import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Container from "../../../../components/Common/Container";
import SearchInput from "../../../../components/SearchInput";
import CitizenSkeleton from "../../../../components/Skeletons/CitizenSkeleton.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { UserContext } from "../../../../services/reducers/UserContext.jsx";
import { getTranslation } from "../../../../services/Utility";
import ResultCard from "./ResultCard";

const DEBOUNCE_MS = 500;

const Results = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;

  @media (min-width: 1920px) {
    margin-bottom: -10px;
  }
`;

const EmptyText = styled.p`
  margin-top: 20px;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.newColors.shades[30]};
`;

const CitizenTab = () => {
  const { Request, HTTP_METHOD } = useRequest();
  const [currentUser] = useContext(UserContext);

  const [searched, setSearched] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const query = searched.trim();

  const search = async (term, isCancelled = () => false) => {
    setIsLoading(true);

    try {
      const response = await Request("search/users", HTTP_METHOD.POST, {
        searchTerm: term,
      });

      // کاربر فعلی از نتایج حذف می‌شود
      const users = response.data.data.filter(
        (user) => String(user.id) !== String(currentUser?.id),
      );

      if (!isCancelled()) setData(users);
    } catch (error) {
      console.error("Error searching users:", error);
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
    if (isLoading) return <CitizenSkeleton />;
    if (data.length === 0) return <EmptyText>{getTranslation("37")}</EmptyText>;

    return (
      <Results>
        {data.map((user) => (
          <ResultCard key={user.id} user={user} />
        ))}
      </Results>
    );
  };

  return (
    <Container>
      <SearchInput
        value={searched}
        placeholder={getTranslation("36")}
        onchange={(e) => setSearched(e.target.value)}
        onSearch={() => query && search(query)}
      />

      {renderResults()}
    </Container>
  );
};

export default CitizenTab;
