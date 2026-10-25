import CardItem from "./CardItem";
import { MdKeyboardArrowDown } from "react-icons/md";
import business from "../../../../assets/images/building.png";
import education from "../../../../assets/images/courthouse.png";
import house from "../../../../assets/images/house.png";
import styled from "styled-components";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Title from "../../../../components/Title";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import { useParams } from "react-router";
import Container from "../../../../components/Common/Container";
import SearchInput from "../../../../components/SearchInput";
import { Skeleton } from "../../../../components/Skeleton";

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
`;

const Provider = styled.div`
  position: relative;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s linear;

  color: ${(props) =>
    props.industry
      ? "#FF0000"
      : props.education
        ? "#0066FF"
        : props.house
          ? "#FFC700"
          : props.theme.colors.newColors.shades.title};

  background-color: ${(props) =>
    props.industry
      ? "#ff000021"
      : props.education
        ? "#0066ff21"
        : props.house
          ? "#ffc70021"
          : "transparent"};

  &:hover {
    background-color: ${(p) => p.hover || p.theme.colors.shades[80]};
  }

  h1 {
    font-size: 16px;
    font-weight: 400;
  }

  span {
    position: absolute;
    left: 10px;
    top: 5px;
    color: red;
    cursor: pointer;
    transition: all 0.2s linear;
  }
`;

const Filter = styled.div`
  position: absolute;
  top: 55px;
  width: 175px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 5px;
  @media (min-width: 1400px) {
    padding: 20px;
    top: 60px;
  }
`;

const Wrapper = styled.div`
  position: relative;
  span {
    white-space: nowrap;
  }
`;

const Select = styled.div`
  border-radius: 5px;
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  color: ${(props) => props.theme.colors.newColors.shades.title};
  padding: 10px 12px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
`;

const Div = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-top: 20px;
  gap: 20px;
  @media (min-width: 900px) {
    grid-template-columns: 1fr 150px;
  }
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 200px;
  }
  @media (min-width: 1400px) {
    grid-template-columns: 1fr 200px;
  }
`;

// اسکلتون کارت حرفه‌ای شبیه Level
const SkeletonCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 4px;
  padding: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
`;

const enhanceFeature = (feature) => {
  const karbari = feature.properties?.karbari;
  const propertyDetails = {
    m: { name: "477", photo: house, color: "#ffc80021", slug: "house" },
    t: { name: "475", photo: business, color: "#ff000021", slug: "industry" },
    a: { name: "476", photo: education, color: "#0066ff21", slug: "education" },
  }[karbari];

  return propertyDetails
    ? { ...feature, properties: { ...feature.properties, ...propertyDetails } }
    : feature;
};

const SEARCH_DEBOUNCE_MS = 500;

const Houses = () => {
  const [searched, setSearched] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [property, setProperty] = useState({
    industry: false,
    house: false,
    education: false,
  });
  const { Request } = useRequest();
  const [features, setFeatures] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const { id } = useParams();

  const baseEndpoint = useMemo(
    () => (id ? `players/${id}/assets` : "my-features"),
    [id],
  );

  const selectedKarbari = useMemo(
    () =>
      [
        property.industry && "t",
        property.education && "a",
        property.house && "m",
      ].filter(Boolean),
    [property],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searched.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searched]);


  const buildFeaturesUrl = useCallback(
    (pageNum) => {
      const params = new URLSearchParams();
      params.append("page", pageNum);

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      if (selectedKarbari.length > 0) {
        params.append("filter", selectedKarbari.join(","));
      }

      return `${baseEndpoint}?${params.toString()}`;
    },
    [baseEndpoint, debouncedSearch, selectedKarbari],
  );
  const fetchPage = useCallback(
    async (pageNum, { replace = false } = {}) => {
      setLoading(true);

      try {
        const response = await Request(buildFeaturesUrl(pageNum));
        const newData = (response.data.data || []).map(enhanceFeature);

        setFeatures((prev) => {
          const base = replace ? [] : prev;
          const uniqueFeatures = newData.filter(
            (f) => !base.some((p) => p.id === f.id),
          );
          return [...base, ...uniqueFeatures];
        });

        setHasMore(!!response.data.links?.next);
        setPage(pageNum + 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [buildFeaturesUrl, Request],
  );
  const loadMoreFeatures = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page);
  }, [loading, hasMore, page, fetchPage]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    fetchPage(1, { replace: true });

  }, [baseEndpoint, debouncedSearch, selectedKarbari]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 200
      ) {
        if (!loading && hasMore) {
          loadMoreFeatures();
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadMoreFeatures, loading, hasMore]);

  const selectedLabel = property.industry
    ? getTranslation("475")
    : property.education
      ? getTranslation("476")
      : getTranslation("477");

  // لودینگ اولیه - فقط اسکلتون کارت‌ها (سرچ و فیلتر ثابت)
  if (initialLoading) {
    return (
      <Container id="scrollable-container" ref={containerRef}>
        <div>
          <Title title={getTranslation("58")} />
        </div>
        <Div>
          <SearchInput
            placeholder={getTranslation("57")}
            value={searched}
            onchange={(e) => setSearched(e.target.value)}
          />
          <Wrapper>
            <Select onClick={() => setOpen(!open)}>
              <span>{selectedLabel}</span>
            </Select>
          </Wrapper>
        </Div>
        <List>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index}>
              <Skeleton width="80px" height="80px" radius="4px" />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Skeleton width="60%" height="18px" radius="4px" />
                <Skeleton width="40%" height="14px" radius="4px" />
              </div>
            </SkeletonCard>
          ))}
        </List>
      </Container>
    );
  }

  return (
    <Container id="scrollable-container" ref={containerRef}>
      <div>
        <Title title={getTranslation("58")} />
      </div>
      <Div>
        <SearchInput
          placeholder={getTranslation("57")}
          value={searched}
          onchange={(e) => setSearched(e.target.value)}
        />
        <Wrapper>
          <Select onClick={() => setOpen(!open)}>
            <span>{selectedLabel}</span>
            <MdKeyboardArrowDown
              style={{
                transform: `${open ? "rotate(180deg)" : "rotate(360deg)"}`,
              }}
            />
          </Select>
          {open && (
            <Filter>
              <Provider
                industry={property.industry}
                hover="#ff000021"
                onClick={() => {
                  setProperty((current) => ({
                    ...current,
                    industry: !current.industry,
                  }));
                  setOpen(false);
                }}
              >
                <h1>{getTranslation("475")}</h1>
                {property.industry && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setProperty((current) => ({ ...current, industry: false }));
                      setOpen(false);
                    }}
                  >
                    X
                  </span>
                )}
              </Provider>
              <Provider
                education={property.education}
                hover="#0066ff21"
                onClick={() => {
                  setProperty((current) => ({
                    ...current,
                    education: !current.education,
                  }));
                  setOpen(false);
                }}
              >
                <h1>{getTranslation("476")}</h1>
                {property.education && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setProperty((current) => ({ ...current, education: false }));
                      setOpen(false);
                    }}
                  >
                    X
                  </span>
                )}
              </Provider>
              <Provider
                house={property.house}
                hover="#ffc70021"
                onClick={() => {
                  setProperty((current) => ({
                    ...current,
                    house: !current.house,
                  }));
                  setOpen(false);
                }}
              >
                <h1>{getTranslation("477")}</h1>
                {property.house && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setProperty((current) => ({ ...current, house: false }));
                      setOpen(false);
                    }}
                  >
                    X
                  </span>
                )}
              </Provider>
            </Filter>
          )}
        </Wrapper>
      </Div>
      <List>
        {features.map((card) => {

          return (
            <CardItem
              {...card.properties}
              key={card.id}
              navigateId={card.id}
              card={card}
              sellReq={card["latest-sell-request"]}
              forSale={card["is-for-sale"]} />


          )
        })}
      </List>

      {loading && features.length > 0 && (
        <div style={{ marginTop: "10px" }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index}>
              <Skeleton width="80px" height="80px" radius="4px" />
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Skeleton width="60%" height="18px" radius="4px" />
                <Skeleton width="40%" height="14px" radius="4px" />
              </div>
            </SkeletonCard>
          ))}
        </div>
      )}
    </Container>
  );
};

export default Houses;
