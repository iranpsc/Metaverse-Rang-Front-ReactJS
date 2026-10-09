import styled from "styled-components";
import Help from "../../assets/svg/exclamation.svg?react";
import Exit from "../../assets/svg/close.svg?react";
import Report from "../../assets/svg/question.svg?react";

export const ReportIcon = styled(Help)`
  width: 40px;
  height: 40px;
  & > :first-child {
    fill: ${(props) => props.theme.colors.newColors.otherColors.iconBg};
  }

  & > :nth-child(2) {
    fill: ${(props) => props.theme.colors.newColors.otherColors.iconText};
  }
  cursor: pointer;
`;

export const HelpIcon = styled(Report)`
  width: 40px;
  height: 40px;
  & > :first-child {
    fill: ${(props) => props.theme.colors.newColors.otherColors.iconBg};
  }

  & > :nth-child(2) {
    fill: ${(props) => props.theme.colors.newColors.otherColors.iconText};
  }
  cursor: pointer;
`;

export const ExitIcon = styled(Exit)`
  width: 40px;
  height: 40px;
  float: inline-end;
  cursor: pointer;
`;
