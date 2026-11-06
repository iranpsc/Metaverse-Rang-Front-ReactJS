import styled from "styled-components";
import DefaultProfile from "../../../../assets/images/defulte-profile.png";
import { getTranslation } from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody";
import UserCode from "../../../../components/UserCode";
const STATS = [
  { id: 1, titleId: "724", field: "level" },
  { id: 2, titleId: "38", field: "followers" },
  { id: 3, titleId: "39", field: null },
];

const Container = styled.div`
  padding-left: 25px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Photo = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  object-fit: cover;

  @media (min-width: 768px) {
    width: clamp(40px, 4vw, 70px);
    height: clamp(40px, 4vw, 70px);
  }
`;

const Stats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 20px;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// اگر عکس لود نشد، پیش‌فرض جایگزین می‌شود (بدون حلقه‌ی بی‌نهایت)
const handleImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = DefaultProfile;
};

const Bio = ({ user }) => (
  <Container>
    <Profile>
      <Photo
        src={user?.photo || DefaultProfile}
        alt={user?.name ?? ""}
        onError={handleImageError}
      />

      <div>
        <TitleBody title={user?.name} />
        {user?.code && <UserCode code={user?.code} />}
      </div>
    </Profile>

    <Stats>
      {STATS.map(({ id, titleId, field }) => (
        <Stat key={id}>
          <TitleBody title={getTranslation(titleId)} />
          <TitleBody title={field ? user?.[field] : "-"} />
        </Stat>
      ))}
    </Stats>
  </Container>
);

export default Bio;
