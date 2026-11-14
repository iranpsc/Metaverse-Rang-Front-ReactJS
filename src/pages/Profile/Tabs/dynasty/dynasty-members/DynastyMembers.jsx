// صفحه‌ی اعضای سلسله (درخت خانواده و دعوت شهروند)؛ اگر کاربر سلسله نداشته باشد یا احراز هویتش کامل نباشد، یک اخطار با دکمه‌ی اقدام بالای صفحه نمایش داده می‌شود و Alert خودش بقیه‌ی صفحه را کم‌رنگ و غیرقابل کلیک می‌کند

import styled from "styled-components";
import { useEffect, useState } from "react";
import useRequest from "../../../../../hooks/useRequest.js";
import CitizenInvite from "./CitizenInvite";
import FamilyTree from "./FamilyTree";
import LoadingSpinner from "../../../../../components/Loading/LoadingSpinner.jsx";
import Container from "../../../../../components/Common/Container";
import DynastyAccessGuard from "../DynastyAccessGuard.jsx";
const MODE_TREE = 1;
const MODE_INVITE = 2;

const EMPTY_MEMBERS = { parent: [], siblings: [], spouse: [], children: [] };
const EMPTY_CITIZENS = [];

// رابطه‌ی بک‌اند => دسته‌ی نمایش
const RELATIONSHIP_CATEGORY = {
  father: "parent",
  mother: "parent",
  sister: "siblings",
  brother: "siblings",
  spouse: "spouse",
  offspring: "children",
};

const categorizeMembers = (familyData) => {
  const categories = { parent: [], siblings: [], spouse: [], children: [] };

  familyData.forEach((member) => {
    categories[RELATIONSHIP_CATEGORY[member.relationship]]?.push(member);
  });

  return categories;
};

const Scroller = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: auto;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const DynastyMembers = () => {
  const { Request } = useRequest();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasDynasty, setHasDynasty] = useState(false);
  const [members, setMembers] = useState(EMPTY_MEMBERS);
  const [ownerImg, setOwnerImg] = useState(null);
  const [mode, setMode] = useState({ mode: MODE_TREE, type: null });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const { data: dynasty } = (await Request("dynasty")).data;
        if (cancelled) return;

        const userHasDynasty = Boolean(dynasty["user-has-dynasty"]);
        setHasDynasty(userHasDynasty);
        if (!userHasDynasty) return;

        const { data: family } = (
          await Request(`dynasty/${dynasty.id}/family/${dynasty.family_id}`)
        ).data;
        if (cancelled) return;

        setOwnerImg(family[0]?.profile_photo);
        setMembers(categorizeMembers(family));
      } catch (err) {
        if (!cancelled) setError("Failed to fetch dynasty members");
        console.error(err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="large" color="#4a90e2" fullScreen={false} />;
  }

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <Scroller>
      <Container>
        <DynastyAccessGuard
          hasDynasty={hasDynasty}
          loading={isLoading}
          error={error}
        >
          {mode.mode === MODE_TREE && (
            <FamilyTree
              setMode={setMode}
              members={members}
              ownerImg={ownerImg}
            />
          )}

          {mode.mode === MODE_INVITE && (
            <CitizenInvite
              setMode={setMode}
              mode={mode}
              memberType={mode.type}
              members={members}
              setMembers={setMembers}
              citizens={EMPTY_CITIZENS}
            />
          )}
        </DynastyAccessGuard>
      </Container>
    </Scroller>
  );
};

export default DynastyMembers;
