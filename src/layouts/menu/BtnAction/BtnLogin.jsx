// دکمه‌ی ورود به حساب در منوی کناری (آیکون ورود و متن؛ با بسته بودن منو فقط آیکون مربعی)؛ با کلیک آدرس ورود را از سرور می‌گیرد و کاربر را به آن هدایت می‌کند و در حین درخواست اسپینر نشان می‌دهد

import { useState } from "react";
import LoginIcon from "../../../assets/svg/login.svg?react";
import Button from "../../../components/Button.jsx";
import { useMenuContext } from "../../../services/reducers/MenuContext.jsx";
import useAuth from "../../../hooks/useAuth.js";
import { getTranslation } from "../../../services/Utility";

const LOGIN_ICON = <LoginIcon width="1em" height="1em" stroke="currentColor" />;

const BASE_STYLE = {
  borderRadius: "10px",
  minHeight: "40px",
};
const OPEN_STYLE = {
  ...BASE_STYLE,
  justifyContent: "space-between",
  width: "100%",
};
const CLOSED_STYLE = {
  ...BASE_STYLE,
  justifyContent: "center",
  width: "40px",
  padding: 0,
};

const BtnLogin = () => {
  const { isOpen } = useMenuContext();
  const { redirectToCentral } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      await redirectToCentral();
    } catch (error) {
      console.error("Login redirect failed:", error);
      setLoading(false);
    }
  };

  return (
    <Button
      style={isOpen ? OPEN_STYLE : CLOSED_STYLE}
      fill
      icon={LOGIN_ICON}
      label={isOpen ? getTranslation("4") : ""}
      onClick={handleLogin}
      disabled={loading ? "pending" : false}
    />
  );
};

export default BtnLogin;