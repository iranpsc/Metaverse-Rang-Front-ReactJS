// گارد بخش‌های خصوصی؛ فقط وقتی کاربر لاگین کرده باشد children را نشان می‌دهد، وگرنه چیزی رندر نمی‌کند.
import useAuth from "../hooks/useAuth.js";

const PrivateComponent = ({ children }) => {
  const { getUser, isLoggedIn } = useAuth();

  return isLoggedIn() && getUser()?.id ? children : null;
};

export default PrivateComponent;