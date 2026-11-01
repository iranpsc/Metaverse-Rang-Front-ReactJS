// آپلودر فایل عمومی (پیش‌نمایش تصویر، حذف، محدودیت تعداد و حجم)؛ با variant="card" به‌شکل کارت خط‌چین تکی (مثل آپلود کارت ملی) نمایش داده می‌شود و با error کادر قرمز می‌گیرد

import { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { HiOutlineTrash } from "react-icons/hi";
import nonPhoto from "../../assets/images/file.png";
import remove from "../../assets/images/remove.png";
import TitleBody from "../TitleBody";
import { getTranslation } from "../../services/Utility";

// اندازه‌ی کارت در variant="card"
const cardSize = css`
  width: 240px;
  height: 147px;

  @media (min-width: 1500px) {
    width: 185px;
  }

  @media (min-width: 1920px) {
    width: 240px;
  }
`;

const Files = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`;

const UploadBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 220px;
  height: 140px;
  border: ${({ $card }) => ($card ? 2 : 1)}px dashed
    ${({ $error }) => ($error ? "red" : "#454545")};
  border-radius: 10px;
  cursor: pointer;

  span {
    font-size: 60px;
    color: #a0a0ab;
  }

  ${({ $card }) => $card && cardSize}
`;

const HiddenInput = styled.input`
  display: none;
`;

const FilePreview = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 10px;
  border-radius: 10px;

  ${({ $card, $error }) =>
    $card &&
    css`
      ${cardSize}
      margin-right: 0;
      overflow: hidden;
      border: 2px dashed ${$error ? "red" : "#454545"};
    `}
`;

const FileImage = styled.img`
  width: 220px;
  height: 140px;
  margin-bottom: 5px;
  border: 1px solid #454545;
  border-radius: 10px;
  object-fit: contain;

  ${({ $card }) =>
    $card &&
    css`
      width: 100%;
      height: 100%;
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

  ${({ $card }) =>
    $card &&
    css`
      top: 10px;
      bottom: auto;
      left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border-radius: 50%;
      background-color: #ffc700;
      color: #1a1a1a;

      svg {
        font-size: 17px;
      }
    `}
`;

const ErrorMessage = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: red;
`;

const FileUploader = ({
  files = [],
  onFilesChange,
  title,
  maxFiles = 5,
  maxFileSizeMB = 1,
  accept = "image/*,.pdf,.doc,.docx",
  multiple = true,
  disabled = false,
  variant = "default", // "default" | "card"
  error = false, // کادر قرمز (فقط برای variant="card")
}) => {
  const isCard = variant === "card";
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const urls = files.map((file) =>
      file instanceof File && file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
    );

    setPreviews(urls);

    return () => {
      urls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [files]);

  const fileHandler = (event) => {
    const input = event.target;
    const selectedFiles = Array.from(input.files || []);

    input.value = "";

    if (!selectedFiles.length) return;

    setMessage("");

    if (files.length + selectedFiles.length > maxFiles) {
      setMessage(getTranslation("1636"));
      return;
    }

    if (selectedFiles.some((file) => file.size > maxFileSizeMB * 1024 * 1024)) {
      setMessage(getTranslation("1643"));
      return;
    }

    onFilesChange([...files, ...selectedFiles]);
  };

  const removeFile = (indexToRemove) => {
    onFilesChange(files.filter((_, index) => index !== indexToRemove));
    setMessage("");
  };

  const getPreview = (file, index) =>
    typeof file === "string" ? file : previews[index] || nonPhoto;

  return (
    <div>
      {title && <TitleBody title={title} />}

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

      {message && <ErrorMessage>{message}</ErrorMessage>}
    </div>
  );
};

export default FileUploader;
