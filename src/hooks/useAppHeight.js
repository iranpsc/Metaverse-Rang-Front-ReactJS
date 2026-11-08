//هوک مناسب محاسبه ارتفاع کانتینر ها

import { useEffect } from "react";

export const useAppHeight = () => {
 useEffect(() => {
  const setAppHeight = () => {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
  };
  setAppHeight();
  window.addEventListener('resize', setAppHeight);
  return () => window.removeEventListener('resize', setAppHeight);
}, []);

};
