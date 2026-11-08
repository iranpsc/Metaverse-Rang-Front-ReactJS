// صفحه‌ی لیست فالوورهای کاربر فعلی یا یک بازیکن (با id در URL) با سرچ روی نام و کد و نمایش وضعیت آنلاین؛ مناسب صفحه‌ی فالوورهای پروفایل
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import Follower from "./FollowerCard.jsx";
import TitleHeader from "../../../../../components/TitleHeader.jsx";
import SearchInput from "../../../../../components/SearchInput.jsx";
import Container from "../../../../../components/Common/Container.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import { useFollow } from "../../../../../services/reducers/FollowContext.jsx";
import { getTranslation } from "../../../../../services/Utility/index.jsx";
import { FollowersSkeletons } from "../../../../../components/Skeletons/FollowersSkeletons.jsx";
const Header = styled.div`
  margin-bottom: 20px;
`;
const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;
const Followers = () => {
  const { id } = useParams();
  const { Request } = useRequest();
  const { isOnline } = useFollow();

  const [searched, setSearched] = useState("");
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Request(id ? `players/${id}/followers` : "followers")
      .then((response) => {
        if (!cancelled) setFollowers(response.data.data ?? []);
      })
      .catch((error) => console.error("Error loading followers:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // جلوگیری از بازنویسی لیست با پاسخ قدیمی هنگام تغییر id
    return () => {
      cancelled = true;
    };
  }, [id]);

  const filteredItems = useMemo(() => {
    const query = searched.toLowerCase().trim();
    if (!query) return followers;

    return followers.filter(
      ({ code, name }) =>
        code?.toLowerCase().includes(query) ||
        name?.toLowerCase().includes(query),
    );
  }, [followers, searched]);

  return (
    <Container>
      <Header>
        <TitleHeader title={getTranslation("38")} />
      </Header>

      <SearchInput
        placeholder={getTranslation("57")}
        value={searched}
        onchange={(e) => setSearched(e.target.value)}
      />

      <List>
        {loading ? (
          <FollowersSkeletons />
        ) : (
          filteredItems.map((item) => (
            <Follower
              key={item.id}
              {...item}
              setFollowers={setFollowers}
              canFollow={item.can?.follow}
              online={isOnline(item.id)}
            />
          ))
        )}
      </List>
    </Container>
  );
};

export default Followers;
