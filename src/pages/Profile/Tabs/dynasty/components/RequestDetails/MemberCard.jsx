import styled from "styled-components";
import defaultProfile from "../../../../../../assets/images/avatars/defulte-profile.png";
import TitleBody from "../../../../../../components/TitleBody";
import UserCode from "../../../../../../components/UserCode";
import { getTranslation } from "../../../../../../services/Utility";

/* ---------- Constants ---------- */

const STATUS_CONFIG = {
  confirmed: { color: "#18C08F", label: 854 },
  pending: { color: "#FFC700", label: 852 },
  rejected: { color: "#FF0000", label: 853 },
};

/* ---------- Styles ---------- */

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  margin-top: 30px;
  padding: 20px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;

  img {
    border-radius: 100%;
    border: 2px solid transparent;
    transition: all 0.2s linear;
  }

  &:hover img {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0px 10px 25px -5px ${({ theme }) => theme.colors.primary};
  }
`;

/* ---------- Component ---------- */

const MemberCard = ({ status, code, date, time, name, image }) => {
  // هر وضعیتِ ناشناخته مثل «رد شده» نمایش داده می‌شود (رفتار قبلی)
  const { color, label } = STATUS_CONFIG[status] ?? STATUS_CONFIG.rejected;

  return (
    <Container>
      <Profile>
        <img
          src={image || defaultProfile}
          alt={name || ""}
          width={80}
          height={80}
        />
        <div>
          <TitleBody title={name} />
          <UserCode code={code} />
        </div>
      </Profile>

      <div>
        <TitleBody title={getTranslation(146)} weight={600} />
        <TitleBody title={getTranslation(label)} color={color} />
      </div>

      <div>
        <TitleBody title={getTranslation(850)} weight={600} />
        <TitleBody title={`${date} | ${time}`} />
      </div>
    </Container>
  );
};

export default MemberCard;
