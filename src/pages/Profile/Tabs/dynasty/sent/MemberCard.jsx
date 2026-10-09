import defulte from "../../../../../assets/images/defulte-profile.png";
import styled from "styled-components";
import { getTranslation } from "../../../../../services/Utility";
import { metarangUrlCitizen } from "../../../../../services/Utility";
const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  padding: 20px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  margin-top: 30px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  &:hover img {
    box-shadow: 0px 10px 25px -5px ${(props) => props.theme.colors.primary};
    border: 2px solid ${(props) => props.theme.colors.primary};
  }
  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 18px;
    font-weight: 500;
  }
  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.primary};
    font-size: 16px;
    font-weight: 500;
  }
  & img {
    border-radius: 100%;
    border: 2px solid transparent;
    transition: all 0.2s linear;
  }
`;

const Status = styled.div`
  h2 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 14px;
    font-weight: 600;
  }
  h3 {
    font-size: 16px;
    font-weight: 400;
    color: ${(props) =>
    props.theme.colors.newColors.otherColors.secondaryBtnText};
    margin-top: 4px;
  }
`;
const Date = styled.div`
  h2 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 14px;
    font-weight: 600;
  }
  h3 {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
    margin-top: 4px;
  }
`;

const MemberCard = ({ status, code, date, time, name, image }) => {
  return (
    <Container>
      <Profile>
        <img src={image || defulte} width={80} height={80} />
        <div>
          <h3>{name}</h3>
          <a

            href={metarangUrlCitizen(code)}
            target="_blank" rel="noreferrer"
          >
            {code}
          </a>
        </div>
      </Profile>
      <Status>
        <h2>{getTranslation(146)}</h2>
        <h3
          style={{
            color: `${status === "confirmed"
              ? "#18C08F"
              : status === "pending"
                ? "#FFC700"
                : "#FF0000"
              }`,
          }}
        >
          {status === "confirmed"
            ? getTranslation(854)
            : status === "pending"
              ? getTranslation(852)
              : getTranslation(853)}
        </h3>
      </Status>
      <Date>
        <h2> {getTranslation(850)} </h2>
        <h3>
          {date} | {time}
        </h3>
      </Date>
    </Container>
  );
};

export default MemberCard;
