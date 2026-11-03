import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Container from "../../../../components/Common/Container";
import SearchInput from "../../../../components/SearchInput";
import CitizenSkeleton from "../../../../components/Skeletons/CitizenSkeleton.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { UserContext } from "../../../../services/reducers/UserContext.jsx";
import { cleanSearchText, getTranslation } from "../../../../services/Utility";
import ResultCard from "./ResultCard";

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

  // کاراکترهای نامرئی (مثلاً از paste) پاک میشن
  const query = cleanSearchText(searched);
  const currentUserId = currentUser?.id;

  // debounce داخل SearchInput انجام میشه؛ paste و Enter هم مقدار رو فوری میفرستن
  useEffect(() => {
    if (!query) {
      setData([]);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    Request("search/users", HTTP_METHOD.POST, { searchTerm: query })
      .then((response) => {
        if (cancelled) return;
        // کاربر فعلی از نتایج حذف میشه
        setData(
          response.data.data.filter(
            (user) => String(user.id) !== String(currentUserId),
          ),
        );
      })
      .catch((error) => {
        console.error("Error searching users:", error);
        if (!cancelled) setData([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query, currentUserId]);

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
      />

      {renderResults()}
    </Container>
  );
};

export default CitizenTab;