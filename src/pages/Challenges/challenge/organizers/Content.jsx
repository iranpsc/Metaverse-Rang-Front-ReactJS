//import Other from "./Other";
import { Tooltip as ReactTooltip } from "react-tooltip";
import styled from "styled-components";
import { useTheme } from "../../../../services/reducers/ThemeContext";
import {
  getTranslation,
  convertToPersian,
  ConvertJalali,
} from "../../../../services/Utility";
import { metarangUrlCitizen } from "../../../../services/Utility";
import red from "../../../../assets/gif/red-color.gif";
import blue from "../../../../assets/gif/blue-color.gif";
import yellow from "../../../../assets/gif/yellow-color.gif";
import useLanguage from "../../../../services/Hooks/useLanguage";
const Container = styled.div`
  padding: 15px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  @media (max-height: 500px) and (max-width: 1000px) {
  padding: 5px;
  }
`;
const MainPhoto = styled.div`
  position: relative;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
  &:hover #hover {
    opacity: 100%;
  }

  order: 1;
`;

const Count = styled.div`
  position: absolute;
  top: 10px;
  ${(props) => (props.isPersian ? "left: 10px;" : "right: 10px;")}
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  padding: 4px 8px;
  z-index: 50;

  background-color: #ffffff;
  span {
    font-size: 14px;
    font-weight: 600;
    color: #949494;
  }

  @media (max-width: 768px) {
    span {
      font-size: 12px;
    }

    img {
      width: 18px;
      height: 18px;
    }
  }
`;

const Hover = styled.div`
  transition: all 0.1s linear;
  opacity: 0;
  position: absolute;
  top: 0;
  padding: 15px;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.713);
  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Contents = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Top = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: #fcfcfc;
  }

  h3 {
    font-size: 13px;
    font-weight: 400;
    color: #fcfcfc;
  }

  @media (max-width: 768px) {
    h2 {
      font-size: 14px;
    }

    h3 {
      font-size: 11px;
    }
  }
`;

const Bottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};
    font-size: 13px;
  }

  @media (max-width: 768px) {
    a {
      font-size: 13px;
    }
  }

  @media (max-width: 480px) {
    a {
      font-size: 12px;
    }
  }
`;
const Center = styled.div`
  div {
    display: flex;
    align-items: center;
    gap: 6px;

    span {
      font-size: 13px;
      font-weight: 400;
      color: #fcfcfc;
    }
  }

  @media (max-width: 768px) {
    div span {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    div span {
      font-size: 11px;
    }
  }
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    font-size: 13px;
    font-weight: 400;
    color: #fcfcfc;
  }

  @media (max-width: 768px) {
    span {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    span {
      font-size: 11px;
    }
  }
`;
const Titlee = styled.h2`
  font-size: 13px;

  font-weight: 500;
  color: #fcfcfc;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;
/**const Others = styled.div`
  display: grid;
  align-items: start;
  margin-top: 10px;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  @media (min-width: 1400px) {
    order: 2;
  }
`;
 */

const Div = styled.div`
  display: grid;
  margin-top: 20px;
  @media (min-width: 1400px) {
    grid-template-columns: 1fr;
  }
`;
const Video = styled.video`
  width: 100%;
  height: auto;
  display: block;
`;
const Image = styled.img`
  object-fit: fill;
  height: 100%;
`;
const Time = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 5px;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.menuBg};
  padding: 5px 20px;
  color: ${({ theme }) => theme.colors.newColors.otherColors.headerMenu};

  h3 {
    font-size: 18px;
    font-weight: 500;
  }

  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    font-size: 24px;
    display: block;
    width: 50px;
    text-align: left;
  }

  @media (max-width: 992px) {
    h3 {
      font-size: 16px;
    }

    span {
      font-size: 20px;
    }
  }

  @media (max-width: 768px) {
    h3 {
      font-size: 15px;
    }

    span {
      font-size: 18px;
    }
  }

  @media (max-width: 480px) {
    h3 {
      font-size: 14px;
    }

    span {
      font-size: 16px;
    }
  }
`;
const Content = ({ organizers, time }) => {
  const main = organizers?.[0];
  const { theme } = useTheme();
  const colors = {
    red,
    blue,
    yellow,
  };
  const { isPersian } = useLanguage();
  const color = colors[main?.investment_asset] ?? null;
  return (
    <Container>
      <Time>
        <h3>{getTranslation(1469)}</h3>
        <div data-tooltip-id="time">
          <span>{time}</span>
          <ReactTooltip
            style={{
              backgroundColor: "#1a1a18",
              borderRadius: "10px",
              width: "150px",
              paddingBottom: "9.5px",
              textAlign: "center",
              zIndex: "999",
            }}
            id="time"
            place="top"
            content={getTranslation(1468)}
          />
        </div>
      </Time>{" "}
      <Div>
        {/**   <Others>
          {organizers?.[8] &&
            organizers.slice(1, 7).map((other) => {
              return <Other key={other.id} {...other} />;
            })}
        </Others>*/}

        <MainPhoto>
          <Count data-tooltip-id="main" isPersian={isPersian}>
            <span>{convertToPersian(organizers[0]?.prize_per_question)}</span>
            <img src={color} alt={main?.count} width={20} height={20} />
            <ReactTooltip
              style={{
                backgroundColor: theme === "light" ? "#FCFCFC" : "#1A1A18",
                borderRadius: "10px",
                width: "100px",
                textAlign: "center",
                zIndex: "999",
                color: theme === "light" ? "#1A1A18" : "#FCFCFC",
              }}
              id="main"
              place="bottom"
              content={getTranslation(1323)}
            />
          </Count>
          <Hover id="hover">
            <div />
            <Contents>
              <Top>
                <h2>{main?.title}</h2>
                <h3>{main?.description}</h3>
              </Top>
              <Bottom>
                <Right>
                  <Titlee>{getTranslation(1470)}</Titlee>
                  <a
                    target={"_blank"}
                    rel="noreferrer"
                    href={metarangUrlCitizen(main?.code)}
                  >
                    {main?.code.toUpperCase()}
                  </a>
                </Right>
                <Center>
                  <Titlee>{getTranslation(1471)}</Titlee>
                  <div>
                    <span>{convertToPersian(main?.investment_value)}</span>
                    <img
                      loading="lazy"
                      src={color}
                      alt={main?.color}
                      width={24}
                      height={24}
                    />
                  </div>
                </Center>
                <Left>
                  <Titlee>{getTranslation(1472)}</Titlee>
                  <span>{convertToPersian(ConvertJalali(main?.ends_at))}</span>
                </Left>
              </Bottom>
            </Contents>
          </Hover>
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
      </Div>
    </Container>
  );
};

export default Content;
