import ResultCard from "./ResultCard";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import SearchInput from "../../../../components/SearchInput";
import useRequest from "../../../../services/Hooks/useRequest";
import { getTranslation } from "../../../../services/Utility";
import { Skeleton } from "../../../../components/Skeleton";
import Container from "../../../../components/Common/Container";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;

  @media (min-width: 1920px) {
    margin-bottom: -10px;
  }
`;


const P = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades[30]};
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
`;

// اسکلتون برای کارت
const SkeletonCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 5px;
  padding: 20px;
  display: grid;
  grid-template-columns: 10fr 1fr;
  gap: 20px;
`;

const CitizenTab = () => {
  const debounceRef = useRef(null);

  const [searched, setSearched] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { Request, HTTP_METHOD } = useRequest();

  const searchHandler = () => {
    if (!searched.trim()) return;
    setIsLoading(true);
    searchAPI(Request, HTTP_METHOD, searched)
      .then((response) => setData(response.data.data))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!searched.trim()) {
      setData([]);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setIsLoading(true);
      searchAPI(Request, HTTP_METHOD, searched)
        .then((response) => {
          setData(response.data.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [searched]);

  const handleInputChange = (e) => {
    setSearched(e.target.value);
  };

  return (
    <Container>
      <SearchInput
        onchange={handleInputChange}
        value={searched}
        placeholder={getTranslation("36")}
        onSearch={searchHandler}
      />

      {isLoading ? (
        // اسکلتون برای 3 کارت
        <Wrapper>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index}>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px"}}>
                <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
                  <Skeleton width="50px" height="50px" radius="50%" />
                  <div>
                    <Skeleton width="120px" height="18px" radius="4px" style={{ marginBottom: "8px" }} />
                    <Skeleton width="80px" height="14px" radius="4px" />
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px", alignItems: "center", justifyContent:"space-between" ,marginTop:"16px"}}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems:"center"}}>
                    <Skeleton width="50px" height="16px" radius="4px"  />
                    <Skeleton width="60px" height="16px" radius="4px" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems:"center"}}>
                    <Skeleton width="50px" height="16px" radius="4px"  />
                    <Skeleton width="60px" height="16px" radius="4px" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems:"center"}}>
                    <Skeleton width="50px" height="16px" radius="4px"  />
                    <Skeleton width="60px" height="16px" radius="4px" />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <Skeleton width="36px" height="36px" radius="1111px" />
                <Skeleton width="36px" height="36px" radius="1111px" />
                <Skeleton width="36px" height="36px" radius="1111px" />
              </div>
            </SkeletonCard>
          ))}
        </Wrapper>
      ) : data.length === 0 ? (
        <P>{getTranslation("37")}</P>
      ) : (
        <Wrapper>
          {data.map((item, i) => (
            <ResultCard key={i} user={item} isLoading={false} />
          ))}
        </Wrapper>
      )}
    </Container>
  );
};

function searchAPI(request, method, query) {
  const url = "search/users";
  const body = { searchTerm: query };
  return request(url, method.POST, body);
}

export default CitizenTab;