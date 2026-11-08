// گارد بخش‌های عمومی؛ فقط وقتی کاربر لاگین نکرده باشد children را نشان می‌دهد (مثلاً صفحه‌ی ورود)، وگرنه چیزی رندر نمی‌کند.
import useAuth from "../hooks/useAuth.js";

const PublicComponent = ({ children }) => {
  const { getUser, isLoggedIn } = useAuth();

  return isLoggedIn() && getUser()?.id ? null : children;
};

export default PublicComponent;
