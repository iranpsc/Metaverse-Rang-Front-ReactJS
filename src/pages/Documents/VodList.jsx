import { MdKeyboardArrowDown } from "react-icons/md";
import styled from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import VodRow from "../../pages/Documents/Tabs/DocsList/VodRow";
import { getTranslation, isMobile } from "../../services/Utility";
import { Skeleton } from "../../components/Skeletons/Skeleton.jsx";

const Container = styled.div`
  border-radius: 0.25rem;
  overflow-x: auto;
  min-height: 93vh;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (min-width: 840px) {
    min-height: 80vh !important;
  }
  @media (min-width: 1920px) {
    width: auto !important;
    min-height: 55vh;
  }
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  margin-top: 5px;
  border-collapse: collapse;
  @media (min-width: 1920px) {
    width: 100% !important;
  }
`;

const TableHead = styled.thead`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};
  border-radius: 10px !important;
`;

const TableHeader = styled.th`
  padding: 20px;
  font-size: 16px;
  @media (max-width: 1024px) {
    font-size: 15px;
    padding: 16px;
  }
  @media (max-width: 950px) {
    padding: 13px;
  }
  font-weight: 500;
  color: ${(props) => props.theme.colors.newColors.shades.title};
  position: relative;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 15px;
`;

const Loader = styled.div`
  margin: 10px 0;
  padding-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    background-color: transparent;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    border: none;
  }
`;

const TitleFilter = styled.div`
  position: absolute;
  top: 65px;
  gap: 5px;
  display: flex;
  flex-direction: column;
  width: max-content;
  padding: 15px;
  border-radius: 10px;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.bgContainer};

  h1 {
    font-size: 16px;
    font-weight: 400;

    &:first-of-type {
      margin: 3px 0;
    }
  }
`;

const FilterOption = styled.div`
  padding: 0 7px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s linear;

  background-color: ${(props) =>
    props.active ? props.theme.colors.shades[80] : "transparent"};
  color: ${(props) =>
    props.active ? props.theme.colors.newColors.primaryText : "inherit"};

  &:hover {
    background-color: ${({ theme }) => theme.colors.shades[80]};
    color: ${({ theme }) => theme.colors.newColors.primaryText};
  }

  span {
    color: red;
    cursor: pointer;
    font-size: 14px;
  }
`;

const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

// اسکلتون برای ردیف
const SkeletonRow = styled.tr`
  td {
    padding: 15px 20px;
    border-bottom: 1px solid #454545;
  }
`;

const VodList = ({
  rows,
  status,
  setStatus,
  domain,
  subdomain,
  isLoading,
  loadMore,
  hasMore,
  isLoadMoreLoading,
}) => {
  const [visibleRows, setVisibleRows] = useState(10);
  const [filters, setFilters] = useState({ status: false });
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const handleLoadMore = async () => {
    if (loadMore && hasMore) {
      const loadedCount = await loadMore();
      setVisibleRows(
        (prevVisibleRows) =>
          prevVisibleRows +
          (typeof loadedCount === "number" ? loadedCount : 10),
      );
    } else {
      setVisibleRows((prevVisibleRows) => prevVisibleRows + 10);
    }
  };

  const handleIntersect = useCallback(
    async (entries) => {
      if (
        entries[0]?.isIntersecting &&
        !isLoadMoreLoading &&
        (hasMore || visibleRows < rows?.length)
      ) {
        await handleLoadMore();
      }
    },
    [hasMore, visibleRows, rows?.length, handleLoadMore, isLoadMoreLoading],
  );

  useEffect(() => {
    if (isMobile) return;
    if (!sentinelRef.current || !(hasMore || visibleRows < rows?.length))
      return;

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "200px",
      threshold: 0.1,
    });
    observer.observe(sentinelRef.current);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, hasMore, visibleRows, rows?.length]);

  const handleFilterClick = (filterKey) => {
    setStatus((prevStatus) => ({
      ...prevStatus,
      [filterKey]: !prevStatus[filterKey],
    }));
    setFilters({ status: false });
  };

  const renderStatusFilters = () => (
    <TitleFilter>
      {["confirmed", "pending", "failed", "read"].map((filterKey) => (
        <FilterOption
          key={filterKey}
          active={status[filterKey]}
          onClick={() => handleFilterClick(filterKey)}
        >
          <h1>
            {filterKey === "confirmed"
              ? getTranslation("1343")
              : filterKey === "pending"
                ? getTranslation("1373")
                : filterKey === "failed"
                  ? getTranslation("1345")
                  : getTranslation("1346")}
          </h1>
          {status[filterKey] && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleFilterClick(filterKey);
              }}
            >
              X
            </span>
          )}
        </FilterOption>
      ))}
    </TitleFilter>
  );

  // اسکلتون برای لودینگ
  if (isLoading) {
    return (
      <Container>
        <Table>
          <TableHead>
            <tr>
              <TableHeader>{getTranslation("1339")}</TableHeader>
              <TableHeader>{getTranslation("1319")}</TableHeader>
              <TableHeader>
                <Div>{getTranslation("1340")}</Div>
              </TableHeader>
              <TableHeader>
                <Div>
                  {getTranslation("1341")}
                  <Arrows
                    onClick={() => setFilters({ status: !filters.status })}
                  >
                    <MdKeyboardArrowDown
                      style={{
                        transform: `${filters.status ? "rotate(180deg)" : "rotate(360deg)"
                          }`,
                      }}
                    />
                  </Arrows>
                </Div>
                {filters.status && renderStatusFilters()}
              </TableHeader>
              <TableHeader>{getTranslation("64")}</TableHeader>
              <TableHeader>{getTranslation("1342")}</TableHeader>
            </tr>
          </TableHead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index}>
                <td>
                  <Skeleton
                    width="60px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="200px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="200px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="80px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="120px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="40px"
                    height="40px"
                    radius="8px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
              </SkeletonRow>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }

  return (
    <Container>
      <Table>
        <TableHead>
          <tr>
            <TableHeader>{getTranslation("1339")}</TableHeader>
            <TableHeader>{getTranslation("1319")}</TableHeader>
            <TableHeader>
              <Div>{getTranslation("1340")}</Div>
            </TableHeader>
            <TableHeader>
              <Div>
                {getTranslation("1341")}
                <Arrows onClick={() => setFilters({ status: !filters.status })}>
                  <MdKeyboardArrowDown
                    style={{
                      transform: `${filters.status ? "rotate(180deg)" : "rotate(360deg)"
                        }`,
                    }}
                  />
                </Arrows>
              </Div>
              {filters.status && renderStatusFilters()}
            </TableHeader>
            <TableHeader style={{ whiteSpace: "nowrap" }}>
              {getTranslation("64")}
            </TableHeader>
            <TableHeader>{getTranslation("1342")}</TableHeader>
          </tr>
        </TableHead>
        <tbody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index}>
                <td>
                  <Skeleton
                    width="60px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="2000px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="200px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="80px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="120px"
                    height="16px"
                    radius="4px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
                <td>
                  <Skeleton
                    width="40px"
                    height="40px"
                    radius="8px"
                    style={{ marginLeft: "auto", marginRight: "auto" }}
                  />
                </td>
              </SkeletonRow>
            ))
            : rows
              ?.slice(0, visibleRows)
              .map((request) => (
                <VodRow
                  key={request.id}
                  {...request}
                  domain={domain}
                  subdomain={subdomain}
                  isLoading={false}
                  
                />
              ))}
        </tbody>
      </Table>
      {isMobile && (hasMore || visibleRows < rows?.length) && (
        <Loader>
          <button onClick={handleLoadMore} disabled={isLoadMoreLoading}>
            {isLoadMoreLoading ? getTranslation(1824) : getTranslation(1410)}
          </button>
        </Loader>
      )}
      {!isMobile && hasMore && (
        <div ref={sentinelRef} style={{ height: 1, width: "100%" }} />
      )}
    </Container>
  );
};

export default VodList;
