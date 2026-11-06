// تب تنظیمات عمومی حساب (اعلان‌ها، گزارش‌ها، معاملات و تایید ورود از طریق پیامک و ایمیل) با کلید روشن/خاموش برای هر مورد و دکمه‌ی ذخیره؛ مناسب صفحه‌ی تنظیمات

import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import Button from "../../../../components/Button";
import Container from "../../../../components/Common/Container";
import OnOff from "../OnOff.jsx";
import useRequest from "../../../../hooks/useRequest.js";
import { AlertContext } from "../../../../services/reducers/AlertContext";
import { getTranslation } from "../../../../services/Utility";
import { SettingsSkeleton } from "../../../../components/Skeletons/SettingsSkeleton.jsx";
import TitleBody from "../../../../components/TitleBody.jsx";
const ALERT_DURATION_MS = 3000;

// key = کلید تنظیم در بک‌اند، label = کلید ترجمه‌ی عنوان
const SETTINGS = [
  { key: "transactions_sms", label: "620" },
  { key: "announcements_sms", label: "615" },
  { key: "transactions_email", label: "621" },
  { key: "announcements_email", label: "616" },
  { key: "trades_sms", label: "622" },
  { key: "reports_sms", label: "617" },
  { key: "trades_email", label: "623" },
  { key: "reports_email", label: "618" },
  { key: "login_verification_sms", label: "623" },
  { key: "login_verification_email", label: "619" },
];

const INITIAL_SETTINGS = Object.fromEntries(
  SETTINGS.map(({ key }) => [key, false]),
);

const Settings = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  gap: 10px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

const PublicTab = () => {
  const { alert, setAlert } = useContext(AlertContext);
  const { Request, HTTP_METHOD } = useRequest();

  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    Request("general-settings")
      .then((response) => setSettings(response.data.data))
      .catch((error) => console.error("Failed to load settings:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key, value) =>
    setSettings((prev) => ({ ...prev, [key]: Boolean(value) }));

  const handleSubmit = () => {
    setIsSending(true);

    // فقط خود تنظیم‌ها ارسال می‌شوند (بدون id و فیلدهای دیگر پاسخ سرور)
    const payload = Object.fromEntries(
      SETTINGS.map(({ key }) => [key, settings[key]]),
    );

    Request(`general-settings/${settings.id}`, HTTP_METHOD.PUT, payload)
      .then(() => {
        setAlert(true);
        setTimeout(() => setAlert(false), ALERT_DURATION_MS);
      })
      .catch((error) => console.error("Failed to update settings:", error))
      .finally(() => setIsSending(false));
  };

  return (
    <Container>
      {loading ? (
        <SettingsSkeleton />
      ) : (
        <>
          {alert && <Alert type="success" text={getTranslation("1480")} />}

          <Settings>
            {SETTINGS.map(({ key, label }) => (
              <Item key={key}>
                <TitleBody title={getTranslation(label)} />
                <OnOff
                  isOn={!settings[key]}
                  onToggle={(value) => handleToggle(key, value)}
                />
              </Item>
            ))}
          </Settings>

          <Button
            label={getTranslation("1481")}
            onClick={handleSubmit}
            disabled={isSending ? "pending" : false}
          />
        </>
      )}
    </Container>
  );
};

export default PublicTab;
