
import styled, { css } from "styled-components";
import avatar from "../../assets/images/avatars/defulte-profile.webp";
import FileUploader from "../FileUploader/FileUploader";
import TitleBody from "../TitleBody";
import { getTone } from "./messageTone";
import { ConvertJalali, convertToPersian } from "../../services/Utility";
/* ---------- Helpers ---------- */
import UserCode from "../UserCode";
import HtmlContent from "../HtmlContent";
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

const getAreas = ({ $isCurrentUser, $hasFiles }) => {
  const rows = $isCurrentUser
    ? ['"avatar name"', '". bubble"', '". files"']
    : ['"name avatar"', '"bubble ."', '"files ."'];

  return rows.slice(0, $hasFiles ? 3 : 2).join(" ");
};

/* ---------- Styles ---------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

// آواتار و حباب پیام در یک ردیف و هم‌سطح‌اند، نام و کد فرستنده بالای حباب و پیوست‌ها زیر حباب می‌آید
// پیام خودِ کاربر کنار شروع خط و پیام طرف مقابل کنار پایان خط قرار می‌گیرد
const Container = styled.div`
  display: grid;
  gap: 0px 12px;
  width: 100%;
  margin: 20px 0 0 0;
  grid-template-areas: ${getAreas};

  ${({ $isCurrentUser }) =>
    $isCurrentUser
      ? css`
          grid-template-columns: 50px minmax(0, 1fr);
        `
      : css`
          grid-template-columns: minmax(0, 1fr) 50px;
        `}
`;
const Avatar = styled.img`
  grid-area: avatar;
  align-self: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;
const Header = styled.div`
  grid-area: name;
  align-self: center;
  justify-self: ${({ $isCurrentUser }) => ($isCurrentUser ? "start" : "end")};
  display: flex;
  flex-direction: column;
  align-items: ${({ $isCurrentUser }) =>
    $isCurrentUser ? "flex-start" : "flex-end"};
  min-width: 0;
`;

const Message = styled.div`
  grid-area: bubble;
  justify-self: ${({ $isCurrentUser }) => ($isCurrentUser ? "start" : "end")};
  min-width: 0;
  max-width: 70%;
  padding: 12px;
  border-radius: 10px;
  background-color: ${(props) => getTone(props).background};
  margin-top: 5px;
`;

const MessageTime = styled.div`
  width: fit-content;
  margin-top: 10px;
  margin-right: auto;
`;

// پیوست‌ها از همان لبه‌ی حباب شروع می‌شوند و هم‌تراز آن هستند
const AttachmentList = styled.div`
  grid-area: files;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-width: 0;
  justify-content: ${({ $isCurrentUser }) =>
    $isCurrentUser ? "flex-start" : "flex-end"};
`;

/* ---------- Component ---------- */

const MessageItem = ({ data, isCurrentUser, tone = "default" }) => {
  if (!data) return null;

  const { author = {}, text, date, time } = data;
  const { name, code, "profile-photo": profilePhoto } = author;

  const attachments = getAttachments(data);
  const messageTime = `${ConvertJalali(date)} | ${convertToPersian(time)}`;
  return (
    <Wrapper>
      <Container
        $isCurrentUser={isCurrentUser}
        $hasFiles={attachments.length > 0}
      >
        <Avatar src={profilePhoto || avatar} alt={`${name || "user"} avatar`} />

        <Header $isCurrentUser={isCurrentUser}>
          <TitleBody weight={600} title={name} />

          {code && <UserCode code={code} />}
        </Header>
        {text.length > 0 && (
          <Message $tone={tone} $isCurrentUser={isCurrentUser}>
            <HtmlContent html={text} />
            <MessageTime $tone={tone}>
              <TitleBody title={messageTime} />
            </MessageTime>
          </Message>
        )}

        {attachments.length > 0 && (
          <AttachmentList $isCurrentUser={isCurrentUser}>
            {attachments.map((url, index) => (
              <FileUploader
                mode="display"
                tone={tone}
                key={`${url}-${index}`}
                file={url}
                time={messageTime}
              />
            ))}
          </AttachmentList>
        )}
      </Container>
    </Wrapper>
  );
};

export default MessageItem;
