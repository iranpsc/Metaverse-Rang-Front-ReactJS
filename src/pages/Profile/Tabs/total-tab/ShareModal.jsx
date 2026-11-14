import {
  FacebookShare,
  LinkedinShare,
  TelegramShare,
  TwitterShare,
  WhatsappShare,
} from "react-share-kit";
import styled from "styled-components";
import { useState } from "react";
import {
  getTranslation,
  metarangUrlCitizen,
} from "../../../../services/Utility";
import ModalXs from "../../../../components/Modal/ModalXs";

const SOCIALS = [
  { name: "Whatsapp", Component: WhatsappShare },
  { name: "Telegram", Component: TelegramShare },
  { name: "Facebook", Component: FacebookShare },
  { name: "Twitter", Component: TwitterShare },
  { name: "Linkedin", Component: LinkedinShare },
];

const Socials = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  gap: 30px;
`;

const Social = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;

  span {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const Copy = styled.div`
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
  border-radius: 10px;
  margin-top: 40px;
  gap: 5px;
  white-space: nowrap;
  padding: 5px 5px 5px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    border-radius: 20px;
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 0 20px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.newColors.primaryText};
  }

  p {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }
`;

const ShareModal = ({ setOpenShare, data }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = metarangUrlCitizen(data?.code);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
  };

  return (
    <ModalXs global title={324} onClose={() => setOpenShare(false)} onlyExit>
      <Socials>
        {SOCIALS.map(({ name, Component }) => (
          <Social key={name}>
            <Component size={52} borderRadius={100} url={shareUrl} />
            <span>{name}</span>
          </Social>
        ))}
      </Socials>

      <Copy>
        <span onClick={handleCopy}>
          {getTranslation(copied ? "1476" : "323")}
        </span>
        <p>{shareUrl}</p>
      </Copy>
    </ModalXs>
  );
};

export default ShareModal;
