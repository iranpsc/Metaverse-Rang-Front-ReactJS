// تب احراز هویت (KYC): وضعیت احراز هویت را یک بار از سرور می‌گیرد و بر اساس آن فرم ارسال مدارک، یا اطلاعات تاییدشده، یا اطلاعات در حال بررسی را نشان می‌دهد؛ مناسب صفحه‌ی verification/identity

import { useEffect, useState } from "react";
import IdentityInfo from "./IdentityInfo";
import IdentityInputs from "./IdentityInputs";
import useRequest from "../../../../hooks/useRequest.js";

const STATUS_PENDING = 0;
const STATUS_VERIFIED = 1;

const IdentityTab = () => {
  const { Request } = useRequest();
  const [kyc, setKyc] = useState(null); // null = در حال لود

  useEffect(() => {
    Request("kyc")
      .then((response) => setKyc(response?.data?.data ?? {}))
      .catch(() => setKyc({}));
  }, []);

  if (!kyc) return null;

  if (kyc.status === STATUS_VERIFIED || kyc.status === STATUS_PENDING) {
    return (
      <IdentityInfo kyc={kyc} showPending={kyc.status === STATUS_PENDING} />
    );
  }

  // بعد از ارسال موفق، داده‌ی برگشتی بک‌اند جایگزین kyc می‌شود و صفحه بدون ریلود عوض می‌شود
  return <IdentityInputs initialKyc={kyc} onSubmitSuccess={setKyc} />;
};

export default IdentityTab;
