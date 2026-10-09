import ResultCard from "./ResultCard";
import styled from "styled-components";
import { useCallback, useState, useEffect } from "react";
import SearchInput from "../../../../components/SearchInput";
import useRequest from "../../../../services/Hooks/useRequest";
import { getTranslation } from "../../../../services/Utility";
import { useRef } from "react";
import { Skeleton } from "../../../../components/Skeleton";
import Container from "../../../../components/Common/Container";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 15px 0 0 0;
`;

const P = styled.p`
  color: ${(props) => props.theme.colors.newColors.shades[30]};
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
`;

// اسکلتون کارت شبیه به تصویر
const SkeletonCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
gap:20px;
margin-top:14px;
`;



const SearchPropertyTab = () => {
  const debounceRef = useRef(null);

  const [searched, setSearched] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { Request, HTTP_METHOD } = useRequest();

  const searchHandler = useCallback(
    (query) => {
      if (!query || query.trim() === "") {
        setData([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      searchAPI(Request, HTTP_METHOD, query)
        .then((response) => {
          setData(response.data.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [Request, HTTP_METHOD],
  );

  useEffect(() => {
    if (!searched.trim()) {
      setData([]);
      setIsLoading(false);
      return;
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchHandler(searched);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searched]);

  const handleInputChange = (e) => {
    setSearched(e.target.value);
  };

  return (
    <Container>
      <SearchInput
        onchange={handleInputChange}
        value={searched}
        placeholder={getTranslation("40")}
        onSearch={searchHandler}
      />

      {isLoading ? (
        <Wrapper>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index}>
              {/* شناسه ملک */}
              <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                <Skeleton width="60px" height="60px" radius="50%" />
                <div>
                  <Skeleton width="120px" height="18px" radius="4px" style={{ marginBottom: "8px" }} />
                  <Skeleton width="80px" height="14px" radius="4px" />
                </div>
              </div>


              {/* قیمت PSC و ریال */}
              <SkeletonRow>
                <Skeleton width="90px" height="18px" radius="4px" />
                <Skeleton width="70px" height="18px" radius="4px" />
              </SkeletonRow>
              <SkeletonRow>
                <Skeleton width="50px" height="18px" radius="4px" />
                <Skeleton width="70px" height="18px" radius="4px" />
              </SkeletonRow>
                            <SkeletonRow>
                <Skeleton width="90px" height="18px" radius="4px" />
                <Skeleton width="60px" height="18px" radius="4px" />
              </SkeletonRow>
                            <SkeletonRow>
                <Skeleton width="90px" height="18px" radius="4px" />
                <Skeleton width="70px" height="18px" radius="4px" />
              </SkeletonRow>
              {/* وضعیت و دکمه خرید */}
             
                <SkeletonRow>
                <Skeleton width="40%" height="44px" radius="999px" />
                <Skeleton width="60%" height="44px" radius="999px" />
              </SkeletonRow>
            
            </SkeletonCard>
          ))}
        </Wrapper>
      ) : data.length === 0 ? (
        <P>{getTranslation("37")}</P>
      ) : (
        <Wrapper>
          {data.map((item, i) => {
            const system = item.owner_code == "HM-2000000" ? true : false;
            return <ResultCard key={i} item={item} system={system} />;
          })}
        </Wrapper>
      )}
    </Container>
  );
};

function searchAPI(request, method, query) {
  const url = "search/features";
  const body = { searchTerm: query };
  return request(url, method.POST, body);
}

export default SearchPropertyTab;