import ConfettiExplosion from "react-confetti-explosion";
import styled from "styled-components";
import { useIsRtl } from "../../../../hooks/useLanguageContext.js";
import { convertToPersian } from "../../../../services/Utility";
import ToolTip from "../../../../components/Tooltip/Tooltip.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
const CONFETTI = {
  success: { offset: 30, color: "#18C08F" },
  fail: { offset: 175, color: "#C30000" },
};

const Container = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Item = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.newColors.otherColors.headerMenu};
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};

  @media (max-width: 1280px) {
    font-size: 14px;
  }
`;

const getConfetti = (shining) => {
  if (shining == null) return null;
  return shining ? CONFETTI.success : CONFETTI.fail;
};

const Footer = ({ footers, shining }) => {
  const isPersian = useIsRtl();
  const confetti = getConfetti(shining);

  return (
    <Container>
      {footers.map(({ id, count, icon, slug }) => (
        <ToolTip
          width="auto"
          key={id}
          place="top"
          content={slug}
          Chidren={
            <Item>
              <TitleBody weight title={convertToPersian(count)} />
              <img src={icon} alt="" width={26} height={26} />
            </Item>
          }
        />
      ))}

      {confetti && (
        <ConfettiExplosion
          style={{
            position: "absolute",
            top: "20px",
            [isPersian ? "right" : "left"]: `${confetti.offset}px`,
            opacity: "0%",
          }}
          particleSize={5}
          width={400}
          height="100vh"
          zIndex={9999}
          colors={[confetti.color]}
        />
      )}
    </Container>
  );
};

export default Footer;
