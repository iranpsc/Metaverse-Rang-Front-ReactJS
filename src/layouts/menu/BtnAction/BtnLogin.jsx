// دکمه‌ی ورود به حساب در منوی کناری (آیکون ورود و متن؛ با بسته بودن منو فقط آیکون)؛ با کلیک آدرس ورود را از سرور می‌گیرد و کاربر را به آن هدایت می‌کند و در حین درخواست اسپینر نشان می‌دهد

import { useState } from "react";
import LoginIcon from "../../../assets/svg/login.svg?react";
import Button from "../../../components/Button.jsx";
import { useMenuContext } from "../../../hooks/useMenuContext.js";
import useRequest from "../../../hooks/useRequest.js";
import { getTranslation } from "../../../services/Utility";

// اندازه‌ی آیکون از font-size خود Button می‌آید (مثل react-icons) و رنگ خط از رنگ متن دکمه
const LOGIN_ICON = <LoginIcon width="1em" height="1em" stroke="currentColor" />;

const BtnLogin = () => {
  const { isOpen } = useMenuContext();
  const { Request, HTTP_METHOD } = useRequest();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);

    Request(
      `auth/redirect?redirect_to=${window.location.origin}`,
      HTTP_METHOD.GET,
      {},
      {},
      "development",
    )
      .then((response) => {
        const url = response?.data?.url;
        if (!url) throw new Error("No link found in response");

        window.location.href = url;
      })
      .catch((error) => {
        console.error("Login redirect failed:", error);
        setLoading(false);
      });
  };

  return (
    <Button
      style={{
        borderRadius: "10px",
        justifyContent: "space-between",
        minHeight: "40px",
        width: "100%",
      }}
      fill
      icon={LOGIN_ICON}
      label={isOpen ? getTranslation("4") : ""}
      onClick={handleLogin}
      disabled={loading ? "pending" : false}
    />
  );
};

export default BtnLogin;
