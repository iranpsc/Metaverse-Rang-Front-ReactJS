// مدال جزئیات یک گفتگو یا گزارش (کارت اطلاعات، لیست پیام‌ها و در صورت پشتیبانی فرم پاسخ و دکمه‌ی بستن)؛ با type کانفیگ همان بخش (tickets یا reports) انتخاب می‌شود و برای بخش جدید فقط یک کانفیگ به CONVERSATION_CONFIG اضافه می‌شود

import styled from "styled-components";
import { useContext, useState } from "react";
import MessageItem from "./MessageItem.jsx";
import ReplyForm from "./ReplyForm";
import Button from "../Button.jsx";
import ModalLg from "../Modal/ModalLg";
import TitleHeader from "../TitleHeader.jsx";
import useRequest from "../../hooks/useRequest.js";
import getModalHeaderFromPrevious from "../../services/TitleManager";
import { UserContext } from "../../services/reducers/UserContext";
import {
  ConvertJalali,
  convertToPersian,
  getTranslation,
  ToastError,
  ToastSuccess,
  truncateText,
} from "../../services/Utility/index.jsx";
import circle from "../../assets/images/link-circle.png";
import insta from "../../assets/images/instagram.png";
import send from "../../assets/images/send-2.png";
import whatsapp from "../../assets/images/whatsapp.png";

const SOCIAL_ICONS = [circle, whatsapp, insta, send];
const MAX_TITLE_LENGTH = 60;

// وضعیتی که در TICKET_STATUSES نباشد (مثل بسته یا رد شده) این را می‌گیرد
const OTHER_STATUS = { label: "1345", color: "#A0A0AB" };
const TICKET_STATUSES = {
  1: { label: "1343", color: "#18C08F" },
  0: { label: "1344", color: "#FFC700" },
};

const formatDateTime = (date, time) =>
  `${ConvertJalali(date)} | ${convertToPersian(time)}`;

/*
  getHeader(data)         => { title, subtitle }
  getFields(data)         => [{ label, value, color? }]
  getMessages(data, user) => لیست پیام‌ها برای MessageItem
  closeUrl و replyUrl اختیاری‌اند؛ اگر نباشند دکمه‌ی بستن و فرم پاسخ نمایش داده نمی‌شوند
*/
const CONVERSATION_CONFIG = {
  tickets: {
    titleId: 1347,
    socialsLabelId: 1348,
    closedStatus: 5,
    closedToastId: 1825,
    repliedToastId: 1841,
    closeUrl: (id) => `tickets/close/${id}`,
    replyUrl: (id) => `tickets/response/${id}`,
    getHeader: (data) => ({ title: data.title, subtitle: `#${data.code}` }),
    getFields: (data) => {
      const { label, color } = TICKET_STATUSES[data.status] ?? OTHER_STATUS;

      return [
        { label: "1340", value: data.sender.name },
        { label: "1341", value: getTranslation(label), color },
        { label: "64", value: formatDateTime(data.date, data.time) },
      ];
    },
    getMessages: (data) => data.messages ?? [],
  },

  reports: {
    titleId: "1386",
    socialsLabelId: 244,
    messageTone: "confirmed",

    getHeader: (data) => {
      // page = صفحه‌ی بزرگ‌تر و title = عنوان صفحه‌ای که گزارش از آن ثبت شده
      const { page, title } = getModalHeaderFromPrevious(data.url);

      return {
        title: truncateText(data.title, MAX_TITLE_LENGTH),
        subtitle: (
          <>
            {getTranslation("1376")} <span>{page}</span>{" "}
            {getTranslation("1377")} <span>{title}</span>
          </>
        ),
      };
    },
    getFields: (data) => {
      const [date, time] = data.datetime.split(" ");

      return [
        { label: "1383", value: `#${convertToPersian(data.id)}` },
        { label: "850", value: formatDateTime(date, time) },
      ];
    },
    // گزارش یک پیام است و نویسنده‌اش کاربر فعلی
    getMessages: (data, user) => {
      const [date, time] = data.datetime.split(" ");

      return [
        {
          id: data.id,
          is_mine: true,
          author: {
            name: user.name,
            code: user.code,
            "profile-photo": user.image,
          },
          text: data.content,
          attachments: data.attachments,
          date,
          time,
        },
      ];
    },
  },
};

const Body = styled.div`
  height: 100%;
  padding-bottom: 15px;
  overflow-y: auto;
`;

const Card = styled.div`
  margin-top: 10px;
  padding: 20px;
  border-radius: 10px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #454545;
`;

const Texts = styled.div`
  p {
    margin: 10px 0;
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  span {
    font-weight: 600;
  }
`;

const Socials = styled.div`
  padding-right: 20px;
  border-right: 1px solid #454545;

  h3 {
    font-size: 13px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
  }

  div {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-top: 12px;
  }
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, 1fr);
  gap: 15px;
  margin-top: 20px;
`;

const Label = styled.h3`
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.newColors.shades.title};
`;

const Value = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: ${({ $color, theme }) =>
    $color ?? theme.colors.newColors.shades.title};
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  margin-right: auto;
`;

const Field = ({ label, color, children }) => (
  <div>
    <Label>{getTranslation(label)}</Label>
    <Value $color={color}>{children}</Value>
  </div>
);

const ConversationDetails = ({ type, data, setData, setShowDetails }) => {
  const { Request } = useRequest();
  const [user] = useContext(UserContext);

  const config = CONVERSATION_CONFIG[type];
  const [messages, setMessages] = useState(() =>
    data && config ? config.getMessages(data, user) : [],
  );

  if (!data || !config) return null;

  const { title, subtitle } = config.getHeader(data);
  const fields = config.getFields(data);
  const canClose = config.closeUrl && messages[0]?.is_mine; // فقط شروع‌کننده‌ی گفتگو می‌تواند آن را ببندد

  const handleClose = () =>
    Request(config.closeUrl(data.id))
      .then(() => {
        ToastSuccess(getTranslation(config.closedToastId));
        setData((prev) => ({ ...prev, status: config.closedStatus }));
        setShowDetails(false);
      })
      .catch((error) => ToastError(error.response?.data?.error));

  const handleSent = (newMessages) => {
    if (newMessages) setMessages(newMessages);
    ToastSuccess(getTranslation(config.repliedToastId));
  };

  return (
    <ModalLg setShowModal={setShowDetails} titleId={config.titleId}>
      <Body>
        <Card>
          <CardHeader>
            <Texts>
              <TitleHeader title={title} />
              <p>{subtitle}</p>
            </Texts>

            <Socials>
              <h3>{getTranslation(config.socialsLabelId)}</h3>
              <div>
                {SOCIAL_ICONS.map((icon) => (
                  <img key={icon} width={24} height={24} src={icon} alt="" />
                ))}
              </div>
            </Socials>
          </CardHeader>

          <Fields $columns={fields.length + (config.closeUrl ? 1 : 0)}>
            {fields.map(({ label, value, color }) => (
              <Field key={label} label={label} color={color}>
                {value}
              </Field>
            ))}

            {config.closeUrl && (
              <Buttons>
                <Button disabled fit grayTheme label={getTranslation("1350")} />
                {canClose && (
                  <Button
                    fit
                    grayTheme
                    label={getTranslation("1349")}
                    onClick={handleClose}
                  />
                )}
              </Buttons>
            )}
          </Fields>
        </Card>

        {messages.map((message, index) => (
          <MessageItem
            key={message.id ?? `${message.date}-${message.time}-${index}`}
            data={message}
            tone={config.messageTone}
            isCurrentUser={message.is_mine}
          />
        ))}

        {config.replyUrl && data.status !== config.closedStatus && (
          <ReplyForm url={config.replyUrl(data.id)} onSent={handleSent} />
        )}
      </Body>
    </ModalLg>
  );
};

export default ConversationDetails;
