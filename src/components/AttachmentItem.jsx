// این کامپوننت برای نمایش یک پیوست (لینک یا File خام) با پیش‌نمایش تصویر/آیکون فایل و دکمه دانلود در همه بخش‌ها مناسبه؛ با پراپ time داخل حباب پیام همراه با زمان نمایش داده میشه (چت تیکت) و بدون time فقط خود پیش‌نمایش رندر میشه (جزئیات یادداشت)

import { useEffect, useState } from "react";
import styled from "styled-components";
import downloadIcon from "../assets/images/download.png";
import fileIcon from "../assets/images/file.png";
import { getTone } from "./ConversationDetails/MessageItem";
const PreviewLink = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  cursor: ${({ $isImage }) => ($isImage ? "pointer" : "default")};

  img {
    width: 100%;
    height: 100%;
    object-fit: ${({ $fit }) => $fit};
  }
`;
const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
]);


const stripQuery = (url) => url.split(/[?#]/)[0];

const isImage = (url) =>
  Boolean(url) &&
  IMAGE_EXTENSIONS.has(stripQuery(url).split(".").pop().toLowerCase());

const getFileName = (url) =>
  (url && stripQuery(url).split("/").pop()) || "file";

const downloadFile = async (url, name) => {
  if (!url) return;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name || "file";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};
const useFileUrl = (source) => {
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!(source instanceof File)) return;

    const url = URL.createObjectURL(source);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [source]);

  return source instanceof File ? objectUrl : source;
};

const Bubble = styled.div`
  width: fit-content;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${(props) => getTone(props).background};
`;

const Time = styled.time`
  display: block;
  width: fit-content;
  margin-top: 10px;
  margin-right: auto;
  color: #a0a0a0ab;
  font-size: 16px;
  font-weight: 400;
`;

const FilePreview = styled.div`
  position: relative;
  width: 220px;
  height: 140px;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
  border: 1px solid gray;
  border-radius: 10px;

  > img {
    width: 100%;
    height: 100%;
    object-fit: ${({ $fit }) => $fit};
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

const AttachmentItem = ({ file, time, fit = "cover", tone = "default" ,  noDownload = false,
}) => {
  const url = useFileUrl(file);
  const isFile = file instanceof File;

  const name = isFile ? file.name : getFileName(file);
  const showAsImage = isFile ? file.type.startsWith("image/") : isImage(url);
  const preview = (
    <FilePreview $fit={fit}>
      {showAsImage && url ? (
        <PreviewLink
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          $isImage
          $fit={fit}
          aria-label={`Open ${name}`}
        >
          <img src={url} alt={name} loading="lazy" />
        </PreviewLink>
      ) : (
        <img src={fileIcon} alt={name} loading="lazy" />
      )}

    {url && !noDownload && (
  <DownloadButton
    type="button"
    onClick={() => downloadFile(url, name)}
    aria-label="Download attachment"
  >
    <img src={downloadIcon} alt="" aria-hidden="true" />
  </DownloadButton>
)}
    </FilePreview>
  );

  if (!time) return preview;

  return (
    <Bubble $tone={tone}>
      {preview}
      <Time>{time}</Time>
    </Bubble>
  );
};

export default AttachmentItem;
