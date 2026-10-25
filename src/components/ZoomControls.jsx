// ایتم های کنترل زوم روی نقشه 
import React from 'react';
import { ZoomContainer, ControlContainer, CustomButton } from '../layouts/map/styles';
import  ZoomIcon  from "../assets/images/zoom.svg?react";
import  UnZoomIcon  from "../assets/images/UnZoom.svg?react";

const ZoomControls = ({ isPersian, onZoomChange }) => (
  <ZoomContainer isPersian={isPersian}>
    <ControlContainer>
      <CustomButton as={ZoomIcon} onClick={() => onZoomChange(1)} />
    </ControlContainer>
    <ControlContainer>
      <CustomButton as={UnZoomIcon} onClick={() => onZoomChange(-1)} />
    </ControlContainer>
  </ZoomContainer>
);

export default React.memo(ZoomControls);