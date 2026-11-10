import { useLocation } from "react-router";
import styled from "styled-components";
import { Skeleton } from "./Skeleton";
import CitizenSkeleton from "./CitizenSkeleton";
import PropertySkeleton from "./PropertySkeleton";
import SuggestionSkeleton from "./SuggestionSkeleton";
import NotificationsSkeleton from "./NotificationsSkeleton";
import ToolsSkeleton from "./ToolsSkeleton";
import NotesListSkeleton from "./NotesListSkeleton";
import { TransactionSkeletons } from "./TransactionSkeletons";
import { FollowingSkeletons } from "./FollowingSkeletons";
import { FollowersSkeletons } from "./FollowersSkeletons";
import { DynastySkeleton } from "./DynastySkeleton";
import { SettingsSkeleton } from "./SettingsSkeleton";
import { AccountSkeleton } from "./AccountSkeleton..jsx";
import { SecuritySkeleton } from "./SecuritySkeleton..jsx";
import { AboutMeSkeleton } from "./AboutMeSkeleton";
import { BankCardSkeleton } from "./BankCardSkeleton";
import LevelSkeleton from "./LevelSkeleton";
import InfoSkeleton from "./InfoSkeleton";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  min-width: 0;
  padding: 16px;
`;

const GenericSkeleton = () => (
  <Container>
    <Skeleton width="35%" height="28px" radius="6px" />
    <Skeleton width="100%" height="120px" radius="10px" />
    <Skeleton width="100%" height="180px" radius="10px" />
  </Container>
);

const TotalSkeleton = () => (
  <Container>
    <InfoSkeleton />
    <LevelSkeleton />
    <Skeleton width="100%" height="160px" radius="10px" />
  </Container>
);

const ReportSkeleton = () => (
  <Container>
    <Skeleton width="35%" height="28px" radius="6px" />
    <Skeleton width="100%" height="120px" radius="10px" />
    <TransactionSkeletons count={3} />
  </Container>
);

const FeatureSkeleton = () => (
  <Container>
    <Skeleton width="100%" height="220px" radius="10px" />
    <Skeleton width="100%" height="48px" radius="8px" />
    <Skeleton width="100%" height="180px" radius="10px" />
  </Container>
);

const DocumentSkeleton = ({ isList }) => (
  <Container>
    <Skeleton width="35%" height="28px" radius="6px" />
    {isList ? (
      Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} width="100%" height="76px" radius="8px" />
      ))
    ) : (
      <>
        <Skeleton width="100%" height="48px" radius="8px" />
        <Skeleton width="100%" height="260px" radius="8px" />
        <Skeleton width="100%" height="48px" radius="8px" />
      </>
    )}
  </Container>
);

const CurrencySkeleton = () => (
  <Container>
    {Array.from({ length: 3 }, (_, index) => (
      <Skeleton key={index} width="100%" height="110px" radius="10px" />
    ))}
  </Container>
);

const IdentitySkeleton = () => (
  <Container>
    <Skeleton width="40%" height="28px" radius="6px" />
    <Skeleton width="100%" height="190px" radius="10px" />
    <Skeleton width="100%" height="48px" radius="8px" />
  </Container>
);

const ProfitSkeleton = () => (
  <Container>
    <Skeleton width="35%" height="28px" radius="6px" />
    <Skeleton width="100%" height="240px" radius="10px" />
    <TransactionSkeletons count={3} />
  </Container>
);

const ChallengeSkeleton = () => (
  <Container>
    <Skeleton width="40%" height="28px" radius="6px" />
    <Skeleton width="100%" height="180px" radius="10px" />
    {Array.from({ length: 4 }, (_, index) => (
      <Skeleton key={index} width="100%" height="52px" radius="8px" />
    ))}
  </Container>
);

const RouteSkeleton = () => {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  const [section, tab, subtab] = segments;

  if (section === "search") {
    if (tab === "property") return <PropertySkeleton />;
    return <CitizenSkeleton />;
  }

  if (section === "profile") {
    if (!tab || tab === "total") return <TotalSkeleton />;
    if (tab === "transactions") return <TransactionSkeletons count={5} />;
    if (tab === "property" && subtab === "following")
      return <FollowingSkeletons />;
    if (tab === "property" && subtab === "followers")
      return <FollowersSkeletons />;
    if (tab === "property") return <PropertySkeleton />;
    if (tab === "dynasty") return <DynastySkeleton />;
    if (tab === "suggestion") {
      return (
        <SuggestionSkeleton
          variant={subtab === "sent" ? "sent" : "received"}
        />
      );
    }
  }

  if (section === "settings") {
    if (!tab || tab === "public") return <SettingsSkeleton />;
    if (tab === "account") return <AccountSkeleton />;
    if (tab === "security") return <SecuritySkeleton />;
    if (tab === "about") return <AboutMeSkeleton />;
  }

  if (section === "documents") {
    if (tab === "notes") {
      return (
        <table>
          <tbody>
            <NotesListSkeleton />
          </tbody>
        </table>
      );
    }
    return <DocumentSkeleton isList={tab === "list"} />;
  }

  if (section === "notifications") return <NotificationsSkeleton />;
  if (section === "store") {
    if (tab !== "currency") return <ToolsSkeleton />;
    return <CurrencySkeleton />;
  }
  if (section === "verification" && tab === "bank")
    return <BankCardSkeleton />;
  if (section === "verification") return <IdentitySkeleton />;
  if (section === "connectWallet") return <IdentitySkeleton />;
  if (section === "profit") return <ProfitSkeleton />;
  if (section === "report") return <ReportSkeleton />;
  if (section === "feature") return <FeatureSkeleton />;
  if (section === "challenges") return <ChallengeSkeleton />;
  if (section === "confirmation") return <IdentitySkeleton />;
  if (section === "successful") {
    return (
      <Container>
        <Skeleton width="100%" height="300px" radius="10px" />
      </Container>
    );
  }

  return <GenericSkeleton />;
};

export default RouteSkeleton;
