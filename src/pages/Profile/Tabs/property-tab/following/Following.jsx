// صفحه‌ی لیست کاربرانی که فالو شده‌اند (برای کاربر فعلی یا یک بازیکن با id در URL) با سرچ روی نام و کد و نمایش وضعیت آنلاین؛ مناسب صفحه‌ی فالویینگ پروفایل

import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import FollowingCard from "./FollowingCard.jsx";
import TitleHeader from "../../../../../components/TitleHeader.jsx";
import SearchInput from "../../../../../components/SearchInput.jsx";
import Container from "../../../../../components/Common/Container.jsx";
import useRequest from "../../../../../hooks/useRequest.js";
import { useFollow } from "../../../../../hooks/useFollow.js";
import { getTranslation } from "../../../../../services/Utility/index.jsx";
import { FollowingSkeletons } from "../../../../../components/Skeletons/FollowingSkeletons.jsx";

const Header = styled.div`
  margin-bottom: 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

const Following = () => {
  const { id } = useParams();
  const { Request } = useRequest();
  const { isOnline } = useFollow();

  const [searched, setSearched] = useState("");
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Request(id ? `players/${id}/following` : "following")
      .then((response) => {
        if (!cancelled) setFollowings(response.data.data ?? []);
      })
      .catch((error) => console.error("Error loading following:", error))
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
    if (!query) return followings;

    return followings.filter(
      ({ code, name }) =>
        code?.toLowerCase().includes(query) ||
        name?.toLowerCase().includes(query),
    );
  }, [followings, searched]);

  return (
    <Container>
      <Header>
        <TitleHeader title={getTranslation("55")} />
      </Header>

      <SearchInput
        placeholder={getTranslation("57")}
        value={searched}
        onchange={(e) => setSearched(e.target.value)}
      />

      <List>
        {loading ? (
          <FollowingSkeletons />
        ) : (
          filteredItems.map((item) => (
            <FollowingCard key={item.id} {...item} online={isOnline(item.id)} />
          ))
        )}
      </List>
    </Container>
  );
};

export default Following;
