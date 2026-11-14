// متن یادداشت پیشنهاد با دکمه‌ی بیشتر/کمتر؛ مناسب Proposer دریافتی و ارسالی
import { useState } from "react";
import styled from "styled-components";
import HtmlContent from "../../../../components/HtmlContent.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
import { getTranslation } from "../../../../services/Utility/index";
import { Text } from "./suggestionStyles";

const NOTE_LIMIT = 277;

const ToggleText = styled.span`
  cursor: pointer;
`;

const ExpandableNote = ({ note }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const text = note || "";
  const isLong = text.length > NOTE_LIMIT;
  const html = isLong && !isExpanded ? `${text.slice(0, NOTE_LIMIT)}...` : text;

  return (
    <Text>
      <HtmlContent html={html} />
      {isLong && (
        <ToggleText onClick={() => setIsExpanded((prev) => !prev)}>
          <TitleBody primary title={getTranslation(isExpanded ? "884" : "774")} />
        </ToggleText>
      )}
    </Text>
  );
};

export default ExpandableNote;