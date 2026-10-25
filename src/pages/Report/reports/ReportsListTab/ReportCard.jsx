import Title from "../../../../components/Title";
import CircleIcon from "../../../../assets/images/link-circle.png";
import instagram from "../../../../assets/images/instagram.png";
import SendIcon from "../../../../assets/images/send-2.png";
import WhatsappIcon from "../../../../assets/images/whatsapp.png";
import styled from "styled-components";
import { getTranslation } from "../../../../services/Utility/index";
import { convertToPersian } from "../../../../services/Utility/index";
import { useLanguage } from "../../../../hooks/useLanguageContext.js";

const Container = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 10px;
  padding: 20px;
  margin-top: 10px;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #454545;
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr /*1fr*/;
  margin-top: 20px;
`;
const Socials = styled.div`
  ${({ isPersian }) =>
    isPersian ? "padding-right: 20px;" : "padding-left: 20px;"}
  ${({ isPersian }) =>
    isPersian
      ? "border-right: 1px solid #454545;"
      : "border-left: 1px solid #454545;"}  
  

  h3 {
    font-size: 13px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
  div {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 20px;

    .stroke-color {
      stroke: ${(props) => props.theme.colors.newColors.shades.title};
    }
  }
`;
const Texts = styled.div`
  p {
    margin: 10px 0;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
    span {
      font-weight: 600;
      color: ${(props) => props.theme.colors.newColors.shades.title};
    }
  }
`;

const Label = styled.h3`
  color: #a0a0ab;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;
const Code = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
`; /**
const Subject = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
`; */
const Status = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 400;
    color: ${(props) =>
      props.status === "confirmed"
        ? "#18C08F"
        : props.status === "pending"
          ? "#FFC700"
          : "#A0A0AB"};
  }
`;
const Date = styled.div`
  h2 {
    font-size: 16px;
    font-weight: 400;
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
`;
const socials = [
  { id: 1, icon: instagram },
  { id: 2, icon: SendIcon },
  { id: 3, icon: WhatsappIcon },
  { id: 4, icon: CircleIcon },
];

const ReportCard = ({
  reportDetails,
  status,
  code,
  date,
  time,
  
  domain,
  subdomain,
}) => {
  const isPersian = useLanguage();
  const truncateTitle = (titleString) => {
    return titleString.length > 60
      ? titleString.substring(0, 60) + "..."
      : titleString;
  };
  return (
    <Container>
      <Info>
        <Texts>
          <Title title={truncateTitle(reportDetails.title)} />
          <p>
            {getTranslation("1376")} <span>{domain}</span>{" "}
            {getTranslation("1377")}
            <span> {subdomain}</span>{" "}
          </p>
        </Texts>
        <Socials isPersian={isPersian}>
          <h3>{getTranslation("244")}</h3>
          <div>
            {socials.map((item) => (
              <img
                src={item.icon}
                key={item.id}
                style={{ width: 24, height: 24 }}
              />
            ))}
          </div>
        </Socials>
      </Info>
      <Content>
        <Code>
          <Label>{getTranslation("1383")} </Label>
          <h2>#{convertToPersian(code)}</h2>
        </Code>
        {/* <Subject>
          <Label>{getTranslation("746")}</Label>
          <h2>{member}</h2>
        </Subject>*/}
        <Status status={status}>
          <Label>{getTranslation("65")}</Label>
          <h2>
            {status === "confirmed"
              ? getTranslation("1343")
              : status === "pending"
                ? getTranslation("852")
                : getTranslation("852")}
            {/*getTranslation("1345")*/}
          </h2>
        </Status>
        <Date>
          <Label>{getTranslation("850")}</Label>
          <h2>
            {date} | {time}
          </h2>
        </Date>
      </Content>
    </Container>
  );
};

export default ReportCard;
