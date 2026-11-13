// کاستوم ادیتور متن؛ در هر جایی که کاربر متن طولانی وارد می‌کند (مثل درباره ما)؛ فونت با پراپ size ریسپانسیو است (مثل LabeledInput)
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { CiEdit } from "react-icons/ci";
import ReactQuill from "react-quill-new";
import styled from "styled-components";

import { convertToPersian, getTranslation } from "../../services/Utility";
import { inputFontSize } from "../../styles/sizes";
import TitleBody from "../TitleBody";

/* ---------- Constants ---------- */

const BORDER_COLOR = "gray";
const FONT_FAMILY = '"AzarMehr"';
const EDITOR_HEIGHT = {
  base: { withToolbar: "1400px", withoutToolbar: "100px" },
  tablet: { withToolbar: "160px", withoutToolbar: "115px" },
  desktop: { withToolbar: "212px", withoutToolbar: "162px" },
};

const getEditorHeight =
  (breakpoint) =>
  ({ $showToolbar }) =>
    EDITOR_HEIGHT[breakpoint][$showToolbar ? "withToolbar" : "withoutToolbar"];
const FORMATS = [
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

/* ---------- Styles ---------- */

// فونت ریسپانسیو با همان بریک‌پوینت‌های LabeledInput (۵۰۰ تا ۹۹۹ تبلت، از ۱۲۸۰ دسکتاپ)
const Container = styled.div`
  margin-top: 20px;
`;

const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${getEditorHeight("base")};

  margin: 10px auto;
  overflow: hidden;
  border-radius: 5px;
  border: ${({ $border }) =>
    $border ? `1px solid ${BORDER_COLOR}` : "none"}!important;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};

  .quill {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    min-height: 0;
  }

  .ql-toolbar {
    display: ${({ $showToolbar }) => ($showToolbar ? "block" : "none")};
    flex-shrink: 0;
    border: none !important;
    border-bottom: 1px solid ${BORDER_COLOR}!important;
    background-color: ${({ theme }) =>
      theme.colors.newColors.otherColors.inputBg};

    .ql-picker {
      color: ${({ theme }) => theme.colors.newColors.shades.title};
    }

    .ql-picker-options {
      border: 1px solid #555;
    }

    .ql-stroke {
      stroke: ${({ theme }) => theme.colors.newColors.shades.title};
    }

    .ql-fill {
      fill: ${({ theme }) => theme.colors.newColors.shades.title};
    }
    @media (min-width: 1000px) {
      padding: 8px;
    }
  }

  .ql-container {
    flex: 1;
    height: auto;
    min-height: 0;
    overflow: hidden;
    border: none !important;
    color: ${({ theme }) => theme.colors.newColors.shades.title};
    background-color: ${({ theme }) =>
      theme.colors.newColors.otherColors.inputBg};
  }

  && .ql-editor {
    height: 100%;
    min-height: 0;
    overflow-y: auto;
    text-align: unset;
    line-height: 1.6;
    font-family: ${FONT_FAMILY} !important;
    -webkit-text-size-adjust: 100%;
    ${inputFontSize}
  }

  && .ql-editor::before {
    font-size: inherit;
    font-family: ${FONT_FAMILY} !important;
    color: #888;
    opacity: 0.7;
  }
  @media (min-width: 500px) and (max-width: 999px) {
    height: ${getEditorHeight("tablet")};
  }

  @media (min-width: 1280px) {
    height: ${getEditorHeight("desktop")};
  }
`;

const Counter = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 5px;

  svg {
    color: ${({ $isOverLimit, theme }) =>
      $isOverLimit ? "red" : theme.colors.newColors.shades.title};
  }
`;

/* ---------- Helpers ---------- */

const getModules = (img, showToolbar) => {
  if (!showToolbar) return { toolbar: false };

  return {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", ...(img ? ["image"] : []), "code-block"],
      [{ align: [] }],
    ],
  };
};

const getHtmlLength = (html) =>
  !html || html === "<p><br></p>" ? 0 : html.length;

/* ---------- Component ---------- */

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
  size = "default",
}) => {
  const [charCount, setCharCount] = useState(() => getHtmlLength(value));
  const quillRef = useRef(null);
  const lastValidRef = useRef({ delta: null, html: value });

  const modules = useMemo(
    () => getModules(img, showToolbar),
    [img, showToolbar],
  );

  // همگام‌سازی با مقدار کنترل‌شده‌ی بیرونی
  useEffect(() => {
    setCharCount(getHtmlLength(value));

    const quill = quillRef.current?.getEditor();
    if (quill) {
      lastValidRef.current = { delta: quill.getContents(), html: value };
    }
  }, [value]);

  // جلوگیری از paste وقتی به سقف کاراکتر رسیده‌ایم
  useEffect(() => {
    const root = quillRef.current?.getEditor()?.root;
    if (!root) return;

    const onPaste = (event) => {
      if (getHtmlLength(lastValidRef.current.html) >= charLimit) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    root.addEventListener("paste", onPaste, true);
    return () => root.removeEventListener("paste", onPaste, true);
  }, [charLimit]);

  const handleChange = (val, _delta, _source, editor) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const newLength = getHtmlLength(val);
    const lastLength = getHtmlLength(lastValidRef.current.html);

    // بیشتر از سقف و در حال افزایش: برگرداندن به آخرین حالت معتبر
    if (newLength > charLimit && newLength >= lastLength) {
      const { delta } = lastValidRef.current;

      if (delta) {
        const selection = quill.getSelection();
        const lengthBefore = quill.getLength();

        quill.setContents(delta, "silent");

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
    <Container>
      {label && <TitleBody title={label} size={size} />}

      <EditorContainer $showToolbar={showToolbar} $border={border}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={handleChange}
          modules={modules}
          formats={FORMATS}
          placeholder={placeholder}
        />
      </EditorContainer>

      <Counter $isOverLimit={isOverLimit} $size={size}>
        {showIcon && <CiEdit size={18} />}
        <TitleBody
          gray2
          small
          title={`${convertToPersian(remainingChars)} ${getTranslation("530")}`}
        />
      </Counter>
    </Container>
  );
};

export default CustomEditor;
