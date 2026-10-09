import { useMemo } from "react";
import { useParams, Navigate, useOutletContext } from "react-router";
import DynastyEstablish from "./dynasty-establish/DynastyEstablish";
import DynastyEstate from "./dynasty-estate/DynastyEstate";
import { Skeleton } from "../../../../components/Skeleton";
import styled from "styled-components";

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px;
`;

// اسکلتون هدر
const SkeletonHeader = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

// اسکلتون کارت اصلی
const SkeletonCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// اسکلتون ردیف جدول
const SkeletonTableRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.inputBorder};
`;

const SkeletonTitle = styled.div`
  margin-bottom: 20px;
`;

const SkeletonBadge = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const DynastyEstablishEstate = () => {
  const { tab } = useParams();
  const { data, setData, loading } = useOutletContext();

  const establishMembers = useMemo(
    () =>
      (data?.prizes ?? []).map((prize, index) => ({
        id: index + 1,
        name: prize.member,
        psc: prize.psc,
        plus: prize.introduction_profit_increase,
        cage: prize.data_storage,
        rial: prize.accumulated_capital_reserve,
        gif: prize.satisfaction,
      })),
    [data],
  );

  // اسکلتون در حین لودینگ
  if (loading) {
    return (
      <SkeletonContainer>
        {/* هدر اسکلتون */}
        <SkeletonHeader>
          <SkeletonTitle>
            <Skeleton width="100px" height="25px" radius="8px" />
          </SkeletonTitle>
          <SkeletonBadge>
            <Skeleton width="150px" height="25px" radius="20px" />
          </SkeletonBadge>
          <Skeleton width="100%" height="60px" radius="8px" />
        </SkeletonHeader>

        {/* کارت اسکلتون */}
        <SkeletonCard>
          {/* هدر جدول */}
          <SkeletonTableRow>
            <Skeleton width="40px" height="40px" radius="10px" />
            <Skeleton width="40px" height="40px" radius="10px" />
            <Skeleton width="40px" height="40px" radius="10px" />
            <Skeleton width="40px" height="40px" radius="10px" />
            <Skeleton width="40px" height="40px" radius="10px" />
            <Skeleton width="40px" height="40px" radius="10px" />
          </SkeletonTableRow>

          {/* ردیف‌های اسکلتون */}
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonTableRow key={index}>
              <Skeleton width="50px" height="14px" radius="4px" />
              <Skeleton width="100px" height="14px" radius="4px" />
              <Skeleton width="60px" height="14px" radius="4px" />
              <Skeleton width="60px" height="14px" radius="4px" />
              <Skeleton width="80px" height="14px" radius="4px" />
              <Skeleton width="60px" height="14px" radius="4px" />
            </SkeletonTableRow>
          ))}
        </SkeletonCard>
      </SkeletonContainer>
    );
  }

  if (tab !== "establish" && tab !== "estate") {
    return <Navigate to="/dynasty/establish" replace />;
  }

  if (data && data["user-has-dynasty"] && tab !== "estate") {
    return <Navigate to="/profile/dynasty/estate" replace />;
  }

  if (data && !data["user-has-dynasty"] && tab !== "establish") {
    return <Navigate to="/dynasty/establish" replace />;
  }

  return tab === "establish" ? (
    <DynastyEstablish data={data} member={establishMembers} setData={setData} />
  ) : (
    <DynastyEstate data={data} setData={setData} />
  );
};

export default DynastyEstablishEstate;