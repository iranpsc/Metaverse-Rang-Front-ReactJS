// لینک کد شهروند که در تب جدید صفحه‌ی پروفایل متارنگ را باز می‌کند؛ مناسب هر جایی که کد شهروند قابل‌کلیک نمایش داده می‌شود؛ آدرس و متن هر دو از پراپ code ساخته می‌شوند؛ فونت با پراپ size ریسپانسیو است (مثل LabeledInput)
import styled from "styled-components";
import { metarangUrlCitizen } from "../services/Utility";
import { getSize } from "../styles/sizes";

const Link = styled.a`
  font-size: ${({ $size }) => getSize($size, "base")};
  font-weight: 500;
  color: #0066ff;
  text-decoration: none;
  text-transform: uppercase;
  overflow-wrap: anywhere;

  @media (min-width: 500px) and (max-width: 999px) {
    font-size: ${({ $size }) => getSize($size, "tablet")};
  }

  @media (min-width: 1280px) {
    font-size: ${({ $size }) => getSize($size, "desktop")};
  }
`;

const UserCode = ({ code, size = "default" }) => {
  if (!code) return null;

  return (
    <Link
      href={metarangUrlCitizen(code)}
      target="_blank"
      rel="noopener noreferrer"
      $size={size}
    >
      {code}
    </Link>
  );
};

export default UserCode;
