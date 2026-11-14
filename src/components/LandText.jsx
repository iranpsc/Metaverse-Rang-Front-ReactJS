// لینک داخلی قابل‌کلیک (مثل شناسه‌ی ملک) که با navigate به مسیر داده‌شده می‌رود و مسیر فعلی را در state.from نگه می‌دارد؛ آدرس با پراپ to و متن نمایشی با پراپ label داده می‌شود؛ فونت با پراپ size ریسپانسیو است (مثل LabeledInput)
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router";
import { getSize } from "../styles/sizes";
const Link = styled.span`
  font-size: ${({ $size }) => getSize($size, "base")};
  font-weight: 500;
  color: #ffc700;
  text-transform: uppercase;
  cursor: pointer;

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }
`;

const LandText = ({ to, label, children, size = "default" }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goTo = () => navigate(to, { state: { from: pathname } });

  return (
    <Link
      role="link"
      tabIndex={0}
      $size={size}
      onClick={goTo}
      onKeyDown={(e) => e.key === "Enter" && goTo()}
    >
      {label ?? children}
    </Link>
  );
};

export default LandText;
