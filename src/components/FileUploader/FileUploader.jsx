// مدیریت فایل در حالت upload (افزودن و حذف) یا display (پیش‌نمایش و دانلود)؛
// با variant="card" به‌شکل کارت خط‌چین تکی (مثل آپلود کارت ملی) نمایش داده می‌شود
// و با error کادر قرمز می‌گیرد
import { useEffect, useRef, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import styled, { css } from "styled-components";

import downloadIcon from "../../assets/images/file-upload/download.png";
import nonPhoto from "../../assets/images/file-upload/file.png";
import remove from "../../assets/images/file-upload/remove.png";
import { getTranslation } from "../../services/Utility";
import { responsiveFontSize, scale } from "../../styles/sizes";
import TitleBody from "../TitleBody";
import { getTone } from "../ConversationDetails/messageTone";

/* ---------- Constants ---------- */

const BORDER_COLOR = "#454545";
const INVALID_COLOR = "red";
const ACCENT_COLOR = "#ffc700";
const EMPTY_FILES = [];
const IMAGE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "webp",
  "svg",
]);

// عرض باکس‌ها در هر پله‌ی صفحه (ارتفاع از aspect-ratio می‌آید)
const WIDTH = {
  default: { base: "140px", tablet: "180px", laptop: "220px" },
  card: { base: "160px", tablet: "200px", laptop: "240px" },
};
const RATIO = { default: "220 / 140", card: "240 / 147" };

const getBorderColor = ({ $error }) => ($error ? INVALID_COLOR : BORDER_COLOR);
const stripQuery = (url) => url.split(/[?#]/)[0];
const getFileName = (url) =>
  (url && stripQuery(url).split("/").pop()) || "file";
const isImageUrl = (url) =>
  Boolean(url) &&
  IMAGE_EXTENSIONS.has(stripQuery(url).split(".").pop().toLowerCase());

/* ---------- Mixins ---------- */

const boxWidth = ({ $card }) => css`
  ${scale("width", $card ? WIDTH.card : WIDTH.default)}

  ${$card &&
  css`
    /* رفتار قبلی کارت در صفحه‌های عریض (چیدمان با سایدبار) */
    @media (min-width: 1500px) {
      width: 185px;
    }
    @media (min-width: 1920px) {
      width: 240px;
    }
  `}
`;

const boxRatio = ({ $card }) => css`
  aspect-ratio: ${$card ? RATIO.card : RATIO.default};
`;

/* ---------- Styles ---------- */

const Files = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  ${scale("gap", { base: "8px", laptop: "10px" })}
`;

const UploadBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: ${({ $card }) => ($card ? 2 : 1)}px dashed ${getBorderColor};
  border-radius: 10px;
  cursor: pointer;
  ${boxWidth}
  ${boxRatio}

  span {
    color: #a0a0ab;
    ${scale("font-size", { base: "26px", tablet: "30px", laptop: "34px" })}
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const FilePreview = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  ${boxWidth}
  ${scale("margin-right", { base: "6px", laptop: "10px" })}

  ${({ $card }) =>
    $card &&
    css`
      ${boxRatio}
      margin-right: 0;
      overflow: hidden;
      border: 2px dashed ${getBorderColor};
    `}
`;

const FileImage = styled.img`
  width: 100%;
  aspect-ratio: ${RATIO.default};
  box-sizing: border-box;
  margin-bottom: 5px;
  border: 1px solid ${BORDER_COLOR};
  border-radius: 10px;
  object-fit: contain;

  ${({ $card }) =>
    $card &&
    css`
      height: 100%;
      aspect-ratio: auto;
      margin-bottom: 0;
      border: none;
      border-radius: 0;
    `}
`;

const RemoveButton = styled.button`
  position: absolute;
  bottom: 10px;
  left: 5px;
  z-index: 1;
  padding: 5px;
  border: none;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;

  img {
    ${scale("width", { base: "28px", tablet: "32px", laptop: "36px" })}
    ${scale("height", { base: "28px", tablet: "32px", laptop: "36px" })}
  }

  ${({ $card }) =>
    $card &&
    css`
      top: 10px;
      bottom: auto;
      left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border-radius: 50%;
      background-color: ${ACCENT_COLOR};
      color: #1a1a1a;
      ${scale("width", { base: "22px", laptop: "24px" })}
      ${scale("height", { base: "22px", laptop: "24px" })}

      svg {
        ${scale("font-size", { base: "15px", laptop: "17px" })}
      }
    `}
`;

const ErrorMessage = styled.div`
  margin: 10px 0;
  color: ${INVALID_COLOR};
  ${responsiveFontSize}
`;

const DisplayBubble = styled.div`
  width: fit-content;
  margin-top: 10px;
  padding: 12px;
  border-radius: 10px;
  background-color: ${(props) => getTone(props).background};
`;

const DisplayTime = styled.time`
  display: block;
  width: fit-content;
  margin-top: 10px;
  margin-right: auto;
  color: #a0a0a0ab;
  font-weight: 400;
  ${responsiveFontSize}
`;

const DisplayPreview = styled.div`
  position: relative;
  overflow: hidden;
  ${scale("width", { base: "140px", tablet: "180px", laptop: "220px" })}
  ${scale("height", { base: "90px", tablet: "115px", laptop: "140px" })}
  background-color: ${({ theme }) => theme.colors.newColors.shades.bg2};
  border: 1px solid gray;
  border-radius: 10px;

  > img {
    width: 100%;
    height: 100%;
    object-fit: ${({ $fit }) => $fit};
  }
`;

const PreviewLink = styled.a`
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;

  img {
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
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 1000px) {
    width: 36px;
    height: 36px;
  }
`;

/* ---------- Helpers ---------- */

const MB = 1024 * 1024;

const isPreviewable = (file) =>
  file instanceof File && file.type.startsWith("image/");

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
    if (!(source instanceof File)) return undefined;

    const url = URL.createObjectURL(source);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [source]);

  return source instanceof File ? objectUrl : source;
};

/* ---------- Component ---------- */

const FileUploader = ({
  mode = "upload",
  files = EMPTY_FILES,
  file,
  onFilesChange,
  title,
  maxFiles = 5,
  maxFileSizeMB = 1,
  accept = "image/*,.pdf,.doc,.docx",
  multiple = true,
  disabled = false,
  variant = "default", // "default" | "card"
  error = false, // کادر قرمز
  size = "default", // "small" | "default" | "big" (روی لیبل)
  time,
  fit = "cover",
  tone = "default",
  noDownload = false,
}) => {
  const isCard = variant === "card";
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const displayUrl = useFileUrl(file);

  useEffect(() => {
    if (mode !== "upload") return undefined;

    const urls = files.map((file) =>
      isPreviewable(file) ? URL.createObjectURL(file) : null,
    );
    setPreviews(urls);

    return () => urls.forEach((url) => url && URL.revokeObjectURL(url));
  }, [files, mode]);

  const fileHandler = (event) => {
    const input = event.target;
    const selectedFiles = Array.from(input.files || []);
    input.value = "";

    if (!selectedFiles.length) return;

    if (files.length + selectedFiles.length > maxFiles) {
      setMessage(getTranslation("1636"));
      return;
    }

    if (selectedFiles.some((file) => file.size > maxFileSizeMB * MB)) {
      setMessage(getTranslation("1643"));
      return;
    }

    setMessage("");
    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
    setMessage("");
  };

  const getPreview = (file, index) =>
    typeof file === "string" ? file : previews[index] || nonPhoto;

  if (mode === "display") {
    const isFile = file instanceof File;
    const name = isFile ? file.name : getFileName(file);
    const showAsImage = isFile
      ? file.type.startsWith("image/")
      : isImageUrl(displayUrl);
    const preview = (
      <DisplayPreview $fit={fit}>
        {showAsImage && displayUrl ? (
          <PreviewLink
            href={displayUrl}
            target="_blank"
            rel="noopener noreferrer"
            $fit={fit}
            aria-label={`Open ${name}`}
          >
            <img src={displayUrl} alt={name} loading="lazy" />
          </PreviewLink>
        ) : (
          <img src={nonPhoto} alt={name} loading="lazy" />
        )}

        {displayUrl && !noDownload && (
          <DownloadButton
            type="button"
            onClick={() => downloadFile(displayUrl, name)}
            aria-label="Download attachment"
          >
            <img src={downloadIcon} alt="" aria-hidden="true" />
          </DownloadButton>
        )}
      </DisplayPreview>
    );

    if (!time) return preview;

    return (
      <DisplayBubble $tone={tone}>
        {preview}
        <DisplayTime $size={size}>{time}</DisplayTime>
      </DisplayBubble>
    );
  }

  return (
    <div>
      {title && <TitleBody title={title} size={size} />}

      <Files>
        {files.map((file, index) => (
          <FilePreview
            key={`${file.name || file}-${index}`}
            $card={isCard}
            $error={error}
          >
            <FileImage
              $card={isCard}
              src={getPreview(file, index)}
              alt={`preview-${index}`}
            />

            {!disabled && (
              <RemoveButton
                type="button"
                $card={isCard}
                aria-label={getTranslation("738")}
                onClick={() => removeFile(index)}
              >
                {isCard ? (
                  <HiOutlineTrash />
                ) : (
                  <img src={remove} alt="" width={36} height={36} />
                )}
              </RemoveButton>
            )}
          </FilePreview>
        ))}

        {!disabled && files.length < maxFiles && (
          <UploadBox
            $card={isCard}
            $error={error}
            onClick={() => fileInputRef.current?.click()}
          >
            <span>+</span>

            <HiddenInput
              ref={fileInputRef}
              type="file"
              multiple={multiple}
              accept={accept}
              onChange={fileHandler}
            />
          </UploadBox>
        )}
      </Files>

      {message && <ErrorMessage $size="small">{message}</ErrorMessage>}
    </div>
  );
};

export default FileUploader;
