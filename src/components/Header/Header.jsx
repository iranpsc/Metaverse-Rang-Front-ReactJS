// کامپوننت هدر صفحه برای نمایش عنوان و دکمه‌های عملیاتی بالای صفحات و مودال‌ها.
// شامل دکمه گزارش مشکل، راهنما/آموزش (Education) و خروج با مسیر بازگشت مناسب است؛
// در حالت profile آیکون‌های هشدار و تنظیمات و در حالت loading آیکون تمام‌صفحه هم نشان داده می‌شود.
import { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation, useNavigate } from "react-router";
import { BiExitFullscreen } from "react-icons/bi";
import { PiGearSixFill } from "react-icons/pi";
import { TiWarning } from "react-icons/ti";

import Report from "../../assets/svg/exclamation.svg?react";
import Help from "../../assets/svg/question.svg?react";
import { ExitIcon } from "../Icons/IconsHeader";
import Education from "../../pages/Feature/Education/Education.jsx";
import useAdviserData from "../../hooks/useAdviserData.js";
import { useSelectedEnvironment } from "../../hooks/useSelectedEnvironment.js";
import { useScrollDirectionContext } from "../../hooks/useScrollDirectionContext.js";
import { getTranslation } from "../../services/Utility";

const DESKTOP = "@media (min-width: 1280px)";

const circleIconStyles = css`
  width: 40px;
  height: 40px;
  cursor: pointer;

  & > :first-child {
    fill: ${({ theme }) => theme.colors.newColors.otherColors.iconBg};
  }

  & > :nth-child(2) {
    fill: ${({ theme }) => theme.colors.newColors.otherColors.iconText};
  }
`;

const ReportIcon = styled(Report)`
  ${circleIconStyles}
`;

const HelpIcon = styled(Help)`
  ${circleIconStyles}
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 320px;
  white-space: nowrap;

  @media (min-width: 998px) {
    margin-top: 10px;
    margin-bottom: 30px;
  }

  @media (max-height: 500px) and (max-width: 1000px) {
    padding-bottom: 5px;
  }
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: ${({ $long }) => ($long ? "14px" : "16px")};
  color: ${({ theme }) => theme.colors.newColors.otherColors.headerMenu};

  ${DESKTOP} {
    font-size: 20px;
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  svg {
    width: 30px;
    height: 30px;
    color: #3b3b3b;

    ${DESKTOP} {
      width: 40px;
      height: 40px;
    }
  }
`;

const FullscreenButton = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 100%;
  background-color: #3b3b3b;
  cursor: pointer;

  svg {
    color: #949494;
  }

  ${DESKTOP} {
    width: 40px;
    height: 40px;
  }
`;

const IconButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 11px;
  height: 11px;
  padding: 10px;
  border-radius: 100%;
  background-color: #3b3b3b;
  cursor: pointer;

  svg {
    transform: scale(1.7);
    color: #949494 !important;
  }

  @media (min-width: 1024px) {
    width: 20px;
    height: 20px;

    svg {
      transform: scale(1.1);
      width: 40px;
      height: 40px;
    }
  }
`;

const Header = ({ title, long, loading, profile, action, handleExit }) => {
  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { resetStates } = useSelectedEnvironment();
  const { updateScrollDirection } = useScrollDirectionContext();

  const adviserKey = `${location.pathname.replace(/\//g, "")}-`;
  const adviserData = useAdviserData(adviserKey, location.state?.locationPage);

  const handleReportClick = () => {
    navigate("/report/send", { state: { from: location.pathname } });
  };

  const handleExitClick = () => {
    updateScrollDirection(false);

    if (handleExit) {
      navigate(location.state?.background?.pathname || "/", { replace: true });
      handleExit();
      return;
    }

    navigate(location.state?.from || "/", { replace: true });

    if (action === "ChangeHiddenState") resetStates();
  };

  return (
    <HeaderWrapper>
      <Title $long={long}>{getTranslation(title)}</Title>

      <Icons>
        {loading && (
          <FullscreenButton>
            <BiExitFullscreen />
          </FullscreenButton>
        )}

        {profile && (
          <>
            <IconButton>
              <TiWarning />
            </IconButton>
            <IconButton>
              <PiGearSixFill />
            </IconButton>
          </>
        )}

        <ReportIcon onClick={handleReportClick} />
        <HelpIcon onClick={() => setIsEducationOpen(true)} />
        <ExitIcon onClick={handleExitClick} />
      </Icons>

      {isEducationOpen && (
        <Education
          setOpenEducation={setIsEducationOpen}
          adviserData={adviserData}
        />
      )}
    </HeaderWrapper>
  );
};

export default Header;
