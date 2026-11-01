// لیست صفحه‌بندی‌شده‌ی املاک (خانه، صنعتی، آموزشی) با سرچ، فیلتر نوع کاربری و اسکرول بی‌نهایت؛ مناسب صفحه‌ی دارایی‌های من یا دارایی‌های یک بازیکن (با id در URL)

import styled from "styled-components";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams } from "react-router";
import { MdKeyboardArrowDown } from "react-icons/md";
import CardItem from "./CardItem.jsx";
import business from "../../../../../assets/images/building.png";
import education from "../../../../../assets/images/courthouse.png";
import house from "../../../../../assets/images/house.png";
import TitleHeader from "../../../../../components/TitleHeader.jsx";
import Container from "../../../../../components/Common/Container.jsx";
import SearchInput from "../../../../../components/SearchInput.jsx";
import { Skeleton } from "../../../../../components/Skeleton.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../../services/Utility/index.jsx";

// کلید = مقدار karbari در دیتای بک‌اند؛ ترتیب کلیدها همان ترتیب نمایش فیلتر است

const useClickOutside = (ref, handler, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, enabled]);
};
const PROPERTY_TYPES = {
  t: {
    name: "475",
    slug: "industry",
    photo: business,
    color: "#ff000021",
    accent: "#FF0000",
  },
  a: {
    name: "476",
    slug: "education",
    photo: education,
    color: "#0066ff21",
    accent: "#0066FF",
  },
  m: {
    name: "477",
    slug: "house",
    photo: house,
    color: "#ffc80021",
    accent: "#FFC700",
  },
};
const TYPE_KEYS = Object.keys(PROPERTY_TYPES);

const SEARCH_DEBOUNCE_MS = 500;
const SCROLL_THRESHOLD_PX = 200;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
`;

const Toolbar = styled.div`
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
`;

const Wrapper = styled.div`
  position: relative;

  span {
    white-space: nowrap;
  }
`;

const Select = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 5px;
  border: 1px solid
    ${({ theme }) => theme.colors.newColors.otherColors.inputBorder};
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Filter = styled.div`
  position: absolute;
  top: 55px;
  width: 175px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 5px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  @media (min-width: 1400px) {
    padding: 20px;
    top: 60px;
  }
`;

const Provider = styled.div`
  position: relative;
  padding: 4px 10px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s linear;
  color: ${({ $active, $accent, theme }) =>
    $active ? $accent : theme.colors.newColors.shades.title};
  background-color: ${({ $active, $bg }) => ($active ? $bg : "transparent")};

  &:hover {
    background-color: ${({ $bg }) => $bg};
  }

  h1 {
    font-size: 16px;
    font-weight: 400;
  }
`;

const SkeletonCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 4px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const SkeletonLines = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CardSkeletons = ({ count = 3 }) =>
  Array.from({ length: count }, (_, index) => (
    <SkeletonCard key={index}>
      <Skeleton width="80px" height="80px" radius="4px" />
      <SkeletonLines>
        <Skeleton width="60%" height="18px" radius="4px" />
        <Skeleton width="40%" height="14px" radius="4px" />
      </SkeletonLines>
    </SkeletonCard>
  ));

const enhanceFeature = (feature) => {
  const type = PROPERTY_TYPES[feature.properties?.karbari];
  if (!type) return feature;

  const { name, photo, color, slug } = type;
  return {
    ...feature,
    properties: { ...feature.properties, name, photo, color, slug },
  };
};

const Houses = () => {
  const { id } = useParams();
  const { Request } = useRequest();
  const containerRef = useRef(null);
  const filterRef = useRef(null);

  const [searched, setSearched] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]); // کلیدهای انتخاب‌شده از PROPERTY_TYPES
  const [features, setFeatures] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const baseEndpoint = useMemo(
    () => (id ? `players/${id}/assets` : "my-features"),
    [id],
  );

  const closeFilter = useCallback(() => setOpen(false), []);
  useClickOutside(filterRef, closeFilter, open);

  const toggleType = (key) => {
    setSelected((current) =>
      TYPE_KEYS.filter((k) =>
        k === key ? !current.includes(k) : current.includes(k),
      ),
    );
  };
  const selectedLabel = getTranslation(PROPERTY_TYPES[selected[0] ?? "m"].name);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearch(searched.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [searched]);

  const buildFeaturesUrl = useCallback(
    (pageNum) => {
      const params = new URLSearchParams({ page: pageNum });
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (selected.length) params.append("filter", selected.join(","));
      return `${baseEndpoint}?${params}`;
    },
    [baseEndpoint, debouncedSearch, selected],
  );

  const fetchPage = useCallback(
    async (pageNum, { replace = false } = {}) => {
      setLoading(true);

      try {
        const { data } = await Request(buildFeaturesUrl(pageNum));
        const newData = (data.data || []).map(enhanceFeature);

        setFeatures((prev) => {
          const base = replace ? [] : prev;
          const ids = new Set(base.map((f) => f.id));
          return [...base, ...newData.filter((f) => !ids.has(f.id))];
        });
        setHasMore(!!data.links?.next);
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

  const loadMore = useCallback(() => {
    if (!loading && hasMore) fetchPage(page);
  }, [loading, hasMore, page, fetchPage]);

  // با تغییر آدرس، سرچ یا فیلتر، لیست از اول لود می‌شود
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    fetchPage(1, { replace: true });
  }, [baseEndpoint, debouncedSearch, selected]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD_PX) {
        loadMore();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <Container id="scrollable-container" ref={containerRef}>
      <div>
        <TitleHeader title={getTranslation("58")} />
      </div>

      <Toolbar>
        <SearchInput
          placeholder={getTranslation("57")}
          value={searched}
          onchange={(e) => setSearched(e.target.value)}
        />

        <Wrapper ref={filterRef}>
          <Select onClick={() => setOpen((prev) => !prev)}>
            <span>{selectedLabel}</span>
            <MdKeyboardArrowDown
              style={{ transform: `rotate(${open ? 180 : 0}deg)` }}
            />
          </Select>

          {open && (
            <Filter>
              {TYPE_KEYS.map((key) => {
                const { name, color, accent } = PROPERTY_TYPES[key];

                return (
                  <Provider
                    key={key}
                    $active={selected.includes(key)}
                    $accent={accent}
                    $bg={color}
                    onClick={() => toggleType(key)}
                  >
                    <h1>{getTranslation(name)}</h1>
                  </Provider>
                );
              })}
            </Filter>
          )}
        </Wrapper>
      </Toolbar>

      <List>
        {!initialLoading &&
          features.map((card) => (
            <CardItem
              {...card.properties}
              key={card.id}
              navigateId={card.id}
              card={card}
              sellReq={card["latest-sell-request"]}
              forSale={card["is-for-sale"]}
            />
          ))}

        {(initialLoading || loading) && <CardSkeletons />}
      </List>
    </Container>
  );
};

export default Houses;
