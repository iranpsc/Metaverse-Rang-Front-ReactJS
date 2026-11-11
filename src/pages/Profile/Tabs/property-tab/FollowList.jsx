// لیست فالوورها/فالویینگ‌های کاربر فعلی یا یک بازیکن (با id در URL) با سرچ روی نام و کد و نمایش وضعیت آنلاین؛ مناسب صفحه‌های فالوورها و فالویینگ پروفایل
import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import MemberCard from "./MemberCard.jsx";
import TitleHeader from "../../../../components/TitleHeader.jsx";
import SearchInput from "../../../../components/SearchInput.jsx";
import Container from "../../../../components/Common/Container.jsx";
import FollowSkeletons from "../../../../components/Skeletons/FollowSkeletons.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { useFollow } from "../../../../services/reducers/FollowContext.jsx";
import { getTranslation } from "../../../../services/Utility/index.jsx";

const Header = styled.div`
  margin-bottom: 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
`;

// کلید type همان مسیر endpoint است
const TYPES = {
  followers: {
    title: "38",
    mode: "follower",
    extraProps: (item, setItems) => ({
      setFollowers: setItems,
      canFollow: item.can?.follow,
    }),
  },
  following: {
    title: "55",
    mode: "following",
    extraProps: () => ({}),
  },
};

const FollowList = ({ type }) => {
  const { title, mode, extraProps } = TYPES[type];
  const { id } = useParams();
  const { Request } = useRequest();
  const { isOnline } = useFollow();

  const [searched, setSearched] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Request(id ? `players/${id}/${type}` : type)
      .then((response) => {
        if (!cancelled) setItems(response.data.data ?? []);
      })
      .catch((error) => console.error(`Error loading ${type}:`, error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // جلوگیری از بازنویسی لیست با پاسخ قدیمی هنگام تغییر id
    return () => {
      cancelled = true;
    };
  }, [id, type]);

  const filteredItems = useMemo(() => {
    const query = searched.toLowerCase().trim();
    if (!query) return items;

    return items.filter(
      ({ code, name }) =>
        code?.toLowerCase().includes(query) ||
        name?.toLowerCase().includes(query),
    );
  }, [items, searched]);

  return (
    <Container>
      <Header>
        <TitleHeader title={getTranslation(title)} />
      </Header>

      <SearchInput
        placeholder={getTranslation("57")}
        value={searched}
        onchange={(e) => setSearched(e.target.value)}
      />

      <List>
        {loading ? (
          <FollowSkeletons type={type} />
        ) : (
          filteredItems.map((item) => (
            <MemberCard
              key={item.id}
              {...item}
              {...extraProps(item, setItems)}
              mode={mode}
              online={isOnline(item.id)}
            />
          ))
        )}
      </List>
    </Container>
  );
};

export default FollowList;
