import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import Alert from "../../../../components/Alert/Alert";
import Button from "../../../../components/Button";
import OnOff from "../OnOff";
import { AlertContext } from "../../../../services/reducers/AlertContext";
import useRequest from "../../../../hooks/useRequest.js";
import { getTranslation } from "../../../../services/Utility";
import Container from "../../../../components/Common/Container";
import { Skeleton } from "../../../../components/Skeleton";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  padding: 10px;
  p {
    font-weight: 500;
    color: ${(props) => props.theme.colors.newColors.shades.title};
    font-size: 14px;
  }
  @media (min-width: 1024px) {
    p {
      font-size: 16px;
    }
  }
`;

const Settings = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

// اسکلتون برای هر آیتم
const SkeletonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  padding: 13px;
`;

const settings = [
  {
    id: 1,
    translationId: "620",
    key: "transactions_sms",
  },
  {
    id: 2,
    translationId: "615",
    key: "announcements_sms",
  },
  {
    id: 3,
    translationId: "621",
    key: "transactions_email",
  },
  {
    id: 4,
    translationId: "616",
    key: "announcements_email",
  },
  { id: 5, translationId: "622", key: "trades_sms" },
  { id: 6, translationId: "617", key: "reports_sms" },
  { id: 7, translationId: "623", key: "trades_email" },
  { id: 8, translationId: "618", key: "reports_email" },
  {
    id: 9,
    translationId: "623",
    key: "login_verification_sms",
  },
  {
    id: 10,
    translationId: "619",
    key: "login_verification_email",
  },
];

const PublicTab = () => {
  const { alert, setAlert } = useContext(AlertContext);
  const { Request, HTTP_METHOD } = useRequest();
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [generalSettings, setGeneralSettings] = useState({
    announcements_sms: false,
    announcements_email: false,
    reports_sms: false,
    reports_email: false,
    login_verification_sms: false,
    login_verification_email: false,
    transactions_sms: false,
    transactions_email: false,
    trades_sms: false,
    trades_email: false,
  });

  useEffect(() => {
    Request("general-settings")
      .then((response) => {
        setGeneralSettings({ ...response.data.data });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleToggleChange = (key, value) => {
    setGeneralSettings((prevState) => ({
      ...prevState,
      [key]: value ? true : false,
    }));
  };

  const handleSubmit = () => {
    setIsSending(true);

    const data = Object.fromEntries(
      Object.entries(generalSettings).filter(([key]) => !key.includes("id")),
    );

    Request(`general-settings/${generalSettings.id}`, HTTP_METHOD.PUT, data)
      .then(() => {
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("Failed to update settings:", error);
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  // اسکلتون لودینگ - شبیه به آیتم‌های تنظیمات
  if (loading) {
    return (
      <Container>
        <Settings>
          {Array.from({ length: 10 }).map((_, index) => (
            <SkeletonWrapper key={index}>
              <Skeleton width="180px" height="20px" radius="4px" />
              <Skeleton width="45px" height="25px" radius="220px" />
            </SkeletonWrapper>
          ))}
        </Settings>
        <Skeleton width="106.66px" height="50px" radius="10px" />
      </Container>
    );
  }

  return (
    <Container>
      {alert && <Alert type="success" text={getTranslation("1480")} />}
      <Settings>
        {settings.map((setting) => (
          <Wrapper key={setting.id}>
            <p>{getTranslation(setting?.translationId)}</p>
            <OnOff
              label={setting?.label}
              isOn={!generalSettings[setting.key]}
              onToggle={(value) => handleToggleChange(setting.key, value)}
            />
          </Wrapper>
        ))}
      </Settings>

      <Button
        label={getTranslation("1481")}
        onclick={handleSubmit}
        disabled={isSending ? "pending" : false}
      />
    </Container>
  );
};

export default PublicTab;
