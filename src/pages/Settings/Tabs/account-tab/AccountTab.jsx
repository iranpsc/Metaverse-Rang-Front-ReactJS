import Bank from "./Bank";
import ChangeCard from "./ChangeCard";
import styled from "styled-components";
import { useEffect, useState } from "react";
import useRequest from "../../../../hooks/useRequest.js";
import Container from "../../../../components/Common/Container";
import { Skeleton } from "../../../../components/Skeleton";

const GridContainer = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 20px;
`;

// اسکلتون کارت Bank (متغیرهای الزامی)
const SkeletonBankCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

// اسکلتون کارت ChangeCard (تغییر شماره موبایل)
const SkeletonChangeCard = styled.div`
  background-color: ${(props) =>
    props.theme.colors.newColors.otherColors.inputBg};
  border-radius: 5px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const SkeletonDivider = styled.div`
  padding-bottom: 15px;
  border-bottom: 1px solid #454545;
`;

const SkeletonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccountTab = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const { Request } = useRequest();

  const mobileChange = {
    inputs: [{ id: "phone", type: "number", label: "631", value: "" }],
  };

  useEffect(() => {
    Request("settings")
      .then((response) => {
        setSettings(response.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleResetMobileSuccess = (nextResetCount) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      available_reset_mobile_resets: nextResetCount,
    }));
  };

  // اسکلتون لودینگ - دقیقاً شبیه تصویر
  if (loading) {
    return (
      <GridContainer>
        <SkeletonChangeCard>
          <Skeleton width="250px" height="24px" radius="4px" />
          <Skeleton width="200px" height="14px" radius="4px" />

          <SkeletonRow>
            <Skeleton width="120px" height="16px" radius="4px" />
            <Skeleton width="80px" height="16px" radius="4px" />
          </SkeletonRow>

          <SkeletonRow>
            <Skeleton width="60px" height="16px" radius="4px" />
            <Skeleton width="80px" height="16px" radius="4px" />
          </SkeletonRow>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Skeleton width="20px" height="20px" radius="4px" />
            <Skeleton width="80px" height="16px" radius="4px" />
          </div>
        </SkeletonChangeCard>

        <SkeletonBankCard>
          <Skeleton width="150px" height="24px" radius="4px" />

          <SkeletonDivider>
            <SkeletonRow>
              <Skeleton width="100px" height="16px" radius="4px" />
              <Skeleton width="40px" height="20px" radius="4px" />
            </SkeletonRow>
          </SkeletonDivider>

          <SkeletonDivider>
            <div style={{ marginBottom: "8px" }}>
              <Skeleton width="130px" height="16px" radius="4px" />
            </div>
            <SkeletonRow>
              <Skeleton width="140px" height="14px" radius="4px" />
              <Skeleton width="40px" height="20px" radius="4px" />
            </SkeletonRow>
          </SkeletonDivider>

          <SkeletonDivider>
            <SkeletonRow>
              <Skeleton width="200px" height="16px" radius="4px" />
              <Skeleton width="40px" height="20px" radius="4px" />
            </SkeletonRow>
          </SkeletonDivider>

          <Skeleton width="100%" height="45px" radius="8px" />
        </SkeletonBankCard>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      <ChangeCard
        inputs={mobileChange.inputs}
        availableResetMobileResets={settings.available_reset_mobile_resets}
        onResetMobileSuccess={handleResetMobileSuccess}
      />
      <Bank settings={settings} />
    </GridContainer>
  );
};

export default AccountTab;
