import { useContext } from "react";
import download from "../../../../assets/images/download.png";
import styled from "styled-components";
import { useLanguage } from "../../../../hooks/useLanguageContext.js";
import { UserContext } from "../../../../services/reducers/UserContext";
import DefaultProfile from "../../../../assets/images/defulte-profile.png";
import { metarangUrlCitizen } from "../../../../services/Utility";
const Content = styled.div``;

const Header = styled.div`
  flex-direction: column;
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 10px;
  span {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 600;
  }
  a {
    color: #0066ff;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
  }
`;
const Text = styled.div`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.confirmed};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.confirmed};
  padding: 12px;
  border-radius: 10px;
  p {
    color: ${(props) => props.theme.colors.newColors.shades[30]};
    font-size: 16px;
    font-weight: 400;
  }
  h4 {
    color: #a0a0ab;
    font-size: 16px;
    font-weight: 400;
    width: fit-content;
    margin-right: auto;
    margin-top: 10px;
  }
`;
const Files = styled.div`
  div {
    display: flex;
    flex-direction: row;
    gap: 10px;
    @media screen and (max-width: 1434px) {
      flex-wrap: wrap;
    }
  }
  h4 {
    color: #a0a0ab;
    font-size: 16px;
    font-weight: 400;
    width: fit-content;
    margin-top: 10px;
  }
  border: 1px solid
    ${(props) => props.theme.colors.newColors.otherColors.confirmed};
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.confirmed};
  display: flex;
  flex-direction: column;
  padding: 12px;
  align-items: end;
  border-radius: 10px;
  margin: 10px 0;
`;

const Avatar = styled.img`
  border-radius: 100%;
  width: 50px;
  object-fit: cover; // برای اطمینان از برش درست تصویر
  height: 50px;
`;

const Container = styled.div`
  display: flex;
  gap: 12px;
  width: 80%;
  ${({ isPersian }) =>
    isPersian ? "margin-left: auto;" : "margin-right: auto;"} margin-top: 20px;
  margin-top: 20px;
`;

const Download = styled.img`
  position: absolute;
  bottom: 5px;
  left: 5px;
  width: 36px;
  height: 36px;
  cursor: pointer;
`;

const Image = styled.div`
  position: relative;
  width: 192px;
  height: 171px;
  border-radius: 10px;
  background-color: white;
  overflow: hidden;
  border: 1px solid gray;
  & img {
    &:first-of-type {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const handleDownload = async (imageSrc, filename) => {
  try {
    const response = await fetch(imageSrc, { mode: "cors" });
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error downloading the image:", error);
  }
};

const openInNewTab = (imageSrc) => {
  window.open(imageSrc, "_blank");
};
const CitizenMessage = (reportDetails) => {
  const [userState] = useContext(UserContext);
  const isPersian = useLanguage();
  const datetime = reportDetails.reportDetails.datetime;
  const Code = userState.code.toUpperCase();

  // تابع برای پردازش و جایگزینی تگ‌های <a>
  const processDescription = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // پیدا کردن همه تگ‌های <a> و بازنویسی آن‌ها
    const links = tempDiv.querySelectorAll("a");
    links.forEach((link) => {
      const textContent = link.textContent; // محتوای داخل تگ <a>
      const newLink = document.createElement("a");
      newLink.href = link.href;
      newLink.target = "_blank"; // باز شدن در تب جدید
      newLink.rel = "noopener noreferrer";
      newLink.textContent = textContent; // متن داخل لینک را حفظ می‌کند
      link.replaceWith(newLink);
    });

    return tempDiv.innerHTML;
  };

  const description = processDescription(reportDetails.reportDetails.content);
  //const attachment = reportDetails.reportDetails.attachments[0];
  const [date, time] = datetime.split(" ");

  return (
    <Container isPersian={isPersian}>
      <Avatar
        src={userState.image || DefaultProfile}
        alt="avatar"
        width={50}
        height={50}
        onError={(e) => {
          e.target.src = DefaultProfile;
        }}
      />
      <Content>
        <Header>
          <span>{userState.name}</span>
          {/* افزودن target و rel به لینک Code */}
          <a
            href={metarangUrlCitizen(userState.code)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {Code}
          </a>
        </Header>
        <Text>
          {/* نمایش متن پردازش‌شده */}
          <div dangerouslySetInnerHTML={{ __html: description }} />
          <h4>
            {date} | {time}
          </h4>
        </Text>
        {reportDetails.reportDetails.attachments &&
          reportDetails.reportDetails.attachments.length > 0 && (
            <Files>
              <div>
                {reportDetails.reportDetails.attachments.map(
                  (imageSrc, index) => (
                    <Image key={index}>
                      <img
                        src={imageSrc}
                        alt={`attachment-${index}`}
                        width={200}
                        height={179}
                        onClick={() => openInNewTab(imageSrc)}
                        style={{ cursor: "pointer" }}
                      />
                      <Download
                        src={download}
                        alt="download"
                        width={36}
                        height={36}
                        onClick={() =>
                          handleDownload(imageSrc, `attachment-${index}.jpeg`)
                        }
                        style={{ cursor: "pointer" }}
                      />
                    </Image>
                  ),
                )}
              </div>
              <h4>
                {date} | {time}
              </h4>
            </Files>
          )}
      </Content>
    </Container>
  );
};

export default CitizenMessage;
