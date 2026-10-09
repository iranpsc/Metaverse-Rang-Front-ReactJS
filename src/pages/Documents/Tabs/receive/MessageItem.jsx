import styled from "styled-components";
import avatar from "../../../../assets/images/defulte-profile.png";
import downloadIcon from "../../../../assets/images/download.png";
import fileIcon from "../../../../assets/images/file.png";
import {
  SanitizeHTML,
  metarangUrlCitizen,
  ConvertJalali,
  convertToPersian,
} from "../../../../services/Utility";

/* ---------- Helpers ---------- */

const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"]);

const stripQuery = (url) => url.split(/[?#]/)[0];

const isImage = (url) =>
  Boolean(url) && IMAGE_EXTENSIONS.has(stripQuery(url).split(".").pop().toLowerCase());

const getFileName = (url) => (url && stripQuery(url).split("/").pop()) || "file";

const downloadFile = (url) => {
  if (!url) return;

  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: getFileName(url),
    target: "_blank",
    rel: "noopener noreferrer",
  });

  document.body.appendChild(link);
  link.click();
  link.remove();
};

const getAttachments = ({ attachments, attachment }) => {
  if (Array.isArray(attachments) && attachments.length > 0) return attachments;
  if (typeof attachment !== "string" || !attachment) return [];

  try {
    const parsed = JSON.parse(attachment);
    return Array.isArray(parsed) ? parsed : [attachment];
  } catch {
    return [attachment];
  }
};

/* ---------- Styles ---------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
padding: 0 10px;
`;

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  margin: 20px 0;
  flex-direction: ${({ $isCurrentUser }) => ($isCurrentUser ? "row" : "row-reverse")};

  > img {
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70%;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isCurrentUser }) => ($isCurrentUser ? "flex-start" : "flex-end")};
  margin-bottom: 10px;

  span {
    color: ${({ theme }) => theme.colors.newColors.shades.title};
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

const Bubble = styled.div`
  padding: 12px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.newColors.otherColors.bgContainer};
`;

const Message = styled(Bubble)`
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    font-size: 16px;
    font-weight: 400;
    line-height: 1.8;
    white-space: pre-wrap;
  }
`;

const MessageTime = styled.time`
  display: block;
  width: fit-content;
  margin-top: 10px;
  margin-right: auto;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
  font-size: 16px;
  font-weight: 400;
`;

const AttachmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  flex-direction: ${({ $isCurrentUser }) => ($isCurrentUser ? "row" : "row-reverse")};
`;

const Attachment = styled(Bubble)`
  width: fit-content;
  margin-top: 10px;
`;

const AttachmentTime = styled(MessageTime)`
  color: #a0a0a0ab;
`;

const FilePreview = styled.div`
  position: relative;
  width: 192px;
  height: 171px;
  overflow: hidden;
  border: 1px solid gray;
  border-radius: 10px;
  background-color: white;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DownloadButton = styled.button`
  position: absolute;
  bottom: 5px;
  left: 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;
  padding: 0;

  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  img {
    width: 36px;
    height: 36px;
  }
`;

/* ---------- Components ---------- */

const AttachmentItem = ({ url, time }) => (
  <Attachment>
    <FilePreview>
      <img src={isImage(url) ? url : fileIcon} alt="attachment" />

      <DownloadButton
        type="button"
        onClick={() => downloadFile(url)}
        aria-label="Download attachment"
      >
        <img src={downloadIcon} alt="" aria-hidden="true" />
      </DownloadButton>
    </FilePreview>

    <AttachmentTime>{time}</AttachmentTime>
  </Attachment>
);

const MessageItem = ({ data, isCurrentUser }) => {
  if (!data) return null;

  const { author = {}, text, date, time } = data;
  const { name, code, "profile-photo": profilePhoto = avatar } = author;

  const attachments = getAttachments(data);
  const messageTime = `${ConvertJalali(date)} | ${convertToPersian(time)}`;

  return (
    <Wrapper>
      <Container $isCurrentUser={isCurrentUser}>
        <img src={profilePhoto} alt={`${name || "user"} avatar`} width={50} height={50} />

        <MessageWrapper>
          <Header $isCurrentUser={isCurrentUser}>
            <span>{name}</span>

            {code && (
              <a href={metarangUrlCitizen(code)} target="_blank" rel="noopener noreferrer">
                {code}
              </a>
            )}
          </Header>

          <Message>
            <p>{SanitizeHTML(text)}</p>
            <MessageTime>{messageTime}</MessageTime>
          </Message>
        </MessageWrapper>
      </Container>

      {attachments.length > 0 && (
        <AttachmentList $isCurrentUser={isCurrentUser}>
          {attachments.map((url, index) => (
            <AttachmentItem key={`${url}-${index}`} url={url} time={messageTime} />
          ))}
        </AttachmentList>
      )}
    </Wrapper>
  );
};

export default MessageItem;