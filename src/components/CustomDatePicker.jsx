// دیت پیکر شخصی سازی شده
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import "react-multi-date-picker/styles/colors/yellow.css";
import DatePicker from "react-multi-date-picker";
import { FaRegCalendarAlt } from "react-icons/fa";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import styled from "styled-components";
import { useLanguage } from "../hooks/useLanguageContext.js";
import { getTranslation } from "../services/Utility";
import { useTheme } from "../hooks/useTheme.js";

const DateContainer = styled.div`
  border-radius: 5px;
  border: 1px solid #454545;
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.newColors.otherColors.inputBg};
  height: 48px;
  padding: 0 10px;
  svg {
    color: ${(props) => props.theme.colors.newColors.shades.title};
  }
  input {
    color: ${(props) => props.theme.colors.newColors.shades.title};
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    &:focus {
      border: none;
      outline: none;
    }
    font-size: 16px;
  }
`;

const CustomDatePicker = ({
  value,
  onChange,
  placeholder,
  format = "YYYY/MM/DD",
  range = false,
  plugins = [],
}) => {
  const language = useLanguage();
  const {  theme } = useTheme();

  const handleChange = (dates) => {
    if (dates) {
      if (range) {
        const [start, end] = dates.toString().split(",");
        onChange([start, end || null]);
      } else {
        onChange(dates);
      }
    } else {
      onChange(range ? [null, null] : null);
    }
  };

  return (
    <DateContainer>
      <DatePicker
        placeholder={placeholder || getTranslation(564)}
        className={theme=== "dark"? "bg-dark yellow" : "bg-light blue"}
        format={format}
        calendar={persian}
        locale={language ? persian_fa : null}
        calendarPosition="bottom-right"
        range={range}
        value={value}
        onChange={handleChange}
        plugins={plugins}
      />
      <FaRegCalendarAlt size={20} />
    </DateContainer>
  );
};

export default CustomDatePicker;