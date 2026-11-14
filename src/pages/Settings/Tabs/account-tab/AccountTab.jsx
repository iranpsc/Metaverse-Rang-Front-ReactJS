// تب تنظیمات حساب (تغییر شماره موبایل و اطلاعات بانکی) در دو ستون؛ تنظیمات را یک بار از سرور می‌گیرد و تا آن موقع اسکلتون نشان می‌دهد

import styled from "styled-components";
import { useEffect, useState } from "react";
import Bank from "./Bank";
import ChangeCard from "./ChangeCard";
import Container from "../../../../components/Common/Container";
import useRequest from "../../../../hooks/useRequest.js";
import { AccountSkeleton } from "../../../../components/Skeletons/AccountSkeleton..jsx";
const MOBILE_CHANGE_INPUTS = [
  { id: "phone", type: "number", label: "631", value: "" },
];

const GridContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 20px;
`;

const AccountTab = () => {
  const { Request } = useRequest();

  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Request("settings")
      .then((response) => {
        if (!cancelled) setSettings(response.data.data);
      })
      .catch((error) => console.error("Failed to load settings:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleResetMobileSuccess = (nextResetCount) =>
    setSettings((prev) => ({
      ...prev,
      available_reset_mobile_resets: nextResetCount,
    }));

  return (
    <GridContainer>
      {loading ? (
        <AccountSkeleton />
      ) : (
        <>
          <ChangeCard
            inputs={MOBILE_CHANGE_INPUTS}
            availableResetMobileResets={settings.available_reset_mobile_resets}
            onResetMobileSuccess={handleResetMobileSuccess}
          />
          <Bank settings={settings} />
        </>
      )}
    </GridContainer>
  );
};

export default AccountTab;
