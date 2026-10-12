import "react-quill-new/dist/quill.snow.css";
import { useState, useEffect, useMemo, useRef } from "react";
import ReactQuill from "react-quill-new";
import { CiEdit } from "react-icons/ci";
import { convertToPersian, getTranslation } from "../../services/Utility";
import styled from "styled-components";

const EditorContainer = styled.div`
  width: 100%;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  overflow: hidden;
  color: white;
  margin: 10px auto;
  height: ${({ showToolbar }) => (showToolbar ? "212px" : "162px")};
  border: ${({ border }) => (border ? "1px solid gray" : "none")};
  display: flex;
  flex-direction: column;

  .quill {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    width: 100%;
    height: 100%;
  }

  .ql-toolbar {
    display: ${({ showToolbar }) => (showToolbar ? "block" : "none")};
    flex-shrink: 0;
    background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
    border: none;
    border-bottom: 1px solid gray;
  }

  .ql-container {
    flex: 1;
    min-height: 0;
    height: auto;
    overflow: hidden;
    background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
    color: ${(props) => props.theme.colors.newColors.shades.title};
    border: none;
  }

  && .ql-editor {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    text-align: unset;
    font-size: 18px !important;
    line-height: 1.6;
    -webkit-text-size-adjust: 100%;
    font-family: "AzarMehr" !important;
  }

  && .ql-editor::before {
    font-size: inherit !important;
    color: #888;
    opacity: 0.7;
    font-family: "AzarMehr" !important;
  }

  .ql-toolbar .ql-picker {
    color: white;
  }

  .ql-toolbar .ql-stroke {
    stroke: ${(props) => props.theme.colors.newColors.shades.title};
  }

  .ql-toolbar .ql-fill {
    fill: ${(props) => props.theme.colors.newColors.shades.title};
  }

  .ql-toolbar .ql-picker-options {
    border: 1px solid #555;
  }

  @media (max-width: 700px) {
    && .ql-editor {
      font-size: 15px !important;
      -webkit-text-size-adjust: 100%;
    }
  }
`;

const Label = styled.h2`
  color: ${(props) => props.theme.colors.newColors.shades.title};
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  font-size: 16px;
  margin-top: 20px;
`;

const Char = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;

  svg {
    color: ${({ isOverLimit, theme }) =>
    isOverLimit ? "red" : theme.colors.newColors.shades.title};
  }

  span {
    color: ${({ isOverLimit }) => (isOverLimit ? "red" : "#a0a0ab")};
    font-size: 13px;
    font-weight: 400;
  }
`;

const formats = [
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
  "code-block",
  "align",
];

const getModules = (img = false, showToolbar = true) => {
  if (!showToolbar) {
    return {
      toolbar: false,
    };
  }

  const toolbar = [
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "code-block"],
    [{ align: [] }],
  ];

  if (img) {
    toolbar[2].splice(1, 0, "image");
  }

  return {
    toolbar,
  };
};

/**
 * طول کل رشته HTML (شامل تگ‌ها، اسپیس‌ها، &nbsp; و ...)
 * ادیتور خالی Quill مقدار <p><br></p> دارد که صفر حساب می‌شود
 */
const getHtmlLength = (html) => {
  if (!html || html === "<p><br></p>") return 0;
  return html.length;
};

/**
 * Reusable RichTextEditor with strict character limit
 * (طول HTML شامل تگ‌ها و اسپیس‌ها حساب می‌شود)
 */
const CustomEditor = ({
  value = "",
  onChange,
  charLimit = 2000,
  label,
  showIcon = true,
  placeholder = "",
  border = false,
  img = false,
  showToolbar = true,
}) => {
  const [charCount, setCharCount] = useState(() => getHtmlLength(value));
  const quillRef = useRef(null);

  // آخرین حالت معتبر ادیتور
  const lastValidRef = useRef({ delta: null, html: value });

  const modules = useMemo(
    () => getModules(img, showToolbar),
    [img, showToolbar],
  );

  // همگام‌سازی با value که از بیرون عوض می‌شود
  useEffect(() => {
    setCharCount(getHtmlLength(value));

    const quill = quillRef.current?.getEditor();
    if (quill) {
      lastValidRef.current = { delta: quill.getContents(), html: value };
    }
  }, [value]);

  // جلوگیری زودهنگام از paste وقتی ظرفیت پر است
  // (فقط برای UX، ضمانت اصلی در handleChange است)
  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const root = quill.root;

    const onPaste = (event) => {
      const current = getHtmlLength(lastValidRef.current.html);
      if (current >= charLimit) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // capture تا قبل از clipboard خود Quill اجرا شود
    root.addEventListener("paste", onPaste, true);
    return () => root.removeEventListener("paste", onPaste, true);
  }, [charLimit]);

  const handleChange = (val, delta, source, editor) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const newLength = getHtmlLength(val);
    const lastLength = getHtmlLength(lastValidRef.current.html);

    // اگر از محدودیت بیشتر شد (و کاهشی نبود) تغییر را برگردان
    if (newLength > charLimit && newLength >= lastLength) {
      const selection = quill.getSelection();
      const lengthBefore = quill.getLength();

      if (lastValidRef.current.delta) {
        quill.setContents(lastValidRef.current.delta, "silent");

        const diff = lengthBefore - quill.getLength();
        const index = Math.max(
          0,
          Math.min((selection?.index ?? 0) - diff, quill.getLength() - 1),
        );
        quill.setSelection(index, 0, "silent");
      }

      setCharCount(lastLength);
      return;
    }

    lastValidRef.current = { delta: editor.getContents(), html: val };
    setCharCount(newLength);
    onChange?.(val);
  };

  const remainingChars = Math.max(0, charLimit - charCount);
  const isOverLimit = charCount >= charLimit;

  return (
    <>
      {label && <Label>{label}</Label>}

      <EditorContainer showToolbar={showToolbar} border={border}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </EditorContainer>

      <Char isOverLimit={isOverLimit}>
        {showIcon && <CiEdit size={18} />}
        <span>
          {convertToPersian(remainingChars)} {getTranslation("530")}
        </span>
      </Char>
    </>
  );
};

export default CustomEditor;