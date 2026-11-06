import styled, { css } from "styled-components";
import blue from "../../../../assets/gif/blue-color.gif";
import red from "../../../../assets/gif/red-color.gif";
import yellow from "../../../../assets/gif/yellow-color.gif";
import useLanguage from "../../../../hooks/useLanguage.js";
import {
  ConvertJalali,
  convertToPersian,
  getTranslation,
} from "../../../../services/Utility";
import TitleBody from "../../../../components/TitleBody.jsx";
import ToolTip from "../../../../components/Tooltip/Tooltip.jsx";
import UserCode from "../../../../components/UserCode.jsx";
const ASSET_GIFS = { red, blue, yellow };
const LIGHT_TEXT = "#fcfcfc";

// اندازه‌ی فونت پایه + مقدار آن در breakpointهای کوچک‌تر
const fontSize = (base, { lg, md, sm } = {}) => css`
  font-size: ${base}px;

  ${lg &&
  css`
    @media (max-width: 992px) {
      font-size: ${lg}px;
    }
  `}
  ${md &&
  css`
    @media (max-width: 768px) {
      font-size: ${md}px;
    }
  `}
  ${sm &&
  css`
    @media (max-width: 480px) {
      font-size: ${sm}px;
    }
  `}
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;

  @media (max-height: 500px) and (max-width: 1000px) {
    padding: 5px;
  }
`;

const Timer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 20px;
  border-radius: 5px;
  color: ${({ theme }) => theme.colors.newColors.otherColors.headerMenu};
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 15px;
  opacity: 0;
  transition: opacity 0.1s linear;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.713);

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const MainPhoto = styled.div`
  position: relative;
  width: 100%;
  margin-top: 20px;
  border-radius: 5px;
  overflow: hidden;

  &:hover ${Overlay} {
    opacity: 1;
  }
`;

const PrizeBadge = styled.div`
  position: absolute;
  top: 10px;
  ${({ $isPersian }) => ($isPersian ? "left: 10px;" : "right: 10px;")}
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #ffffff;

  span {
    font-weight: 600;
    color: #949494;
    ${fontSize(14, { md: 12 })}
  }

  @media (max-width: 768px) {
    img {
      width: 18px;
      height: 18px;
    }
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
`;

const Description = styled.div`
  color: ${LIGHT_TEXT};

  h2 {
    font-weight: 500;
    ${fontSize(16, { md: 14 })}
  }

  h3 {
    font-weight: 400;
    ${fontSize(13, { md: 11 })}
  }
`;

const Stats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  color: ${LIGHT_TEXT};
  ${fontSize(13, { md: 12, sm: 11 })}
`;

const Video = styled.video`
  display: block;
  width: 100%;
  height: auto;
`;

const Image = styled.img`
  height: 100%;
  object-fit: fill;
`;

const Content = ({ organizers, time }) => {
  const { currentLang, isRtl } = useLanguage();

  const main = organizers?.[0];
  const assetGif = ASSET_GIFS[main?.investment_asset] ?? null;

  return (
    <Container>
      <Timer>
        <TitleBody weight title={getTranslation(1469)} />
        <TitleBody big weight primary title={time} />
      </Timer>

      <MainPhoto>
        <ToolTip
          place="bottom"
          lang={currentLang}
          content={getTranslation("1323")}
          Chidren={
            <PrizeBadge $isPersian={isRtl}>
              <TitleBody title={convertToPersian(main?.prize_per_question)} />

              <img
                src={assetGif}
                alt={main?.investment_asset}
                width={20}
                height={20}
              />
            </PrizeBadge>
          }
        />

        <Overlay>
          <Details>
            <Description>
              <TitleBody color="#fcfcfc" weight title={main?.title} />
              <TitleBody color="#fcfcfc" title={main?.description} />
            </Description>

            <Stats>
              <Stat>
                <TitleBody
                  small
                  color="#fcfcfc"
                  title={getTranslation("1470")}
                />
                <UserCode code={main?.code} />
              </Stat>

              <Stat>
                <TitleBody
                  small
                  color="#fcfcfc"
                  title={getTranslation("1471")}
                />
                <StatValue>
                  <TitleBody
                    small
                    color="#fcfcfc"
                    title={convertToPersian(main?.investment_value)}
                  />
                  <img
                    loading="lazy"
                    src={assetGif}
                    alt={main?.investment_asset}
                    width={24}
                    height={24}
                  />
                </StatValue>
              </Stat>

              <Stat>
                <TitleBody
                  small
                  color="#fcfcfc"
                  title={getTranslation("1472")}
                />
                <StatValue>
                  <TitleBody
                    small
                    color="#fcfcfc"
                    title={convertToPersian(ConvertJalali(main?.ends_at))}
                  />
                </StatValue>
              </Stat>
            </Stats>
          </Details>
        </Overlay>

        {main?.video_url ? (
          <Video src={main.video_url} autoPlay muted loop playsInline />
        ) : (
          <Image
            loading="lazy"
            src={main?.image_url}
            alt={main?.company}
            width={70}
            height={70}
          />
        )}
      </MainPhoto>
    </Container>
  );
};

export default Content;
