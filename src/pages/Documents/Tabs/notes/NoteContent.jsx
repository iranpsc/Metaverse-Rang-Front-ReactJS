import styled from "styled-components";
import FileUploader from "../../../../components/FileUploader/FileUploader";
import { getTranslation } from "../../../../services/Utility";
import HtmlContent from "../../../../components/HtmlContent";
import TitleBody from "../../../../components/TitleBody";
const EMPTY_ATTACHMENTS = [];

const Wrapper = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const Box = styled.div`
  border: 1px solid #454545;
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
`;

const Attachments = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
`;

// این کامپوننت برای نمایش متن و پیوست‌های یک یادداشت (متن ساده و پیش‌نمایش لینک‌ها یا فایل‌های خام همراه با دکمه دانلود) در جزئیات یادداشت استفاده میشه
const NoteContent = ({ data }) => {
  const attachments = Array.isArray(data?.attachments)
    ? data.attachments
    : EMPTY_ATTACHMENTS;

  return (
    <Wrapper>
      <Box>
        <TitleBody weight title={getTranslation("1371")} />
        <HtmlContent html={data?.content} />

        <Attachments>
          {attachments.map((file, index) => (
            <FileUploader
              mode="display"
              key={typeof file === "string" ? file : `${file.name}-${index}`}
              file={file}
              fit="contain"
            />
          ))}
        </Attachments>
      </Box>
    </Wrapper>
  );
};

export default NoteContent;
