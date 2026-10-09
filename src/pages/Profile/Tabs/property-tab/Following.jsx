import FollowingCard from "./FollowingCard";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Title from "../../../../components/Title";
import SearchInput from "../../../../components/SearchInput";
import useRequest from "../../../../services/Hooks/useRequest";
import { getTranslation } from "../../../../services/Utility";
import { useParams } from "react-router";
import Container from "../../../../components/Common/Container";
import { Skeleton } from "../../../../components/Skeleton";
import { useFollow } from "../../../../services/reducers/FollowContext";

const List = styled.div`
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SkeletonCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SkeletonProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SkeletonImage = styled(Skeleton)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const SkeletonButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 20px;
  @media (min-width: 1300px) {
    flex-direction: row;
  }
`;

const Following = () => {
  const [searched, setSearched] = useState("");
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { Request } = useRequest();
  const { id } = useParams();
  const { isOnline } = useFollow();

  useEffect(() => {
  const endpoint = id ? `players/${id}/following` : "following";
  setLoading(true);
  Request(endpoint)
    .then((response) => {
      setFollowings(response.data.data);
    })
    .catch((error) => {
      console.error("Error loading following:", error);
    })
    .finally(() => {
      setLoading(false);
    });
}, [id]);

  const filteredItems = followings.filter((item) => {
    const query = searched.toLowerCase().trim();
    const codeMatch = item.code?.toLowerCase().includes(query);
    const nameMatch = item.name?.toLowerCase().includes(query);
    return codeMatch || nameMatch;
  });
  return (
    <Container>
      <div style={{ marginBottom: "20px" }}>
        <Title title={getTranslation("55")} />
      </div>
      <SearchInput
        placeholder={getTranslation("57")}
        value={searched}
        onchange={(e) => setSearched(e.target.value)}
      />
      <List>
        {loading
          ? // اسکلتون فقط برای لیست - کادر جستجو ثابت
            Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCard key={index}>
                <SkeletonProfile>
                  <SkeletonImage />
                  <div>
                    <Skeleton
                      width="120px"
                      height="24px"
                      radius="6px"
                      style={{ marginBottom: "8px" }}
                    />
                    <Skeleton width="80px" height="16px" radius="4px" />
                  </div>
                </SkeletonProfile>
                <SkeletonButtons>
                  <Skeleton width="140px" height="48px" radius="8px" />
                </SkeletonButtons>
              </SkeletonCard>
            ))
          : filteredItems.map((item) => (
              <FollowingCard
                key={item.id}
                {...item}
                online={isOnline(item.id)}
              />
            ))}
      </List>
    </Container>
  );
};

export default Following;
