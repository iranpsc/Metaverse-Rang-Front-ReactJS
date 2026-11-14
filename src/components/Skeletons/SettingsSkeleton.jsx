// اسکلتون صفحه‌های تنظیمات با لیست کلید روشن/خاموش (شبکه‌ی دو ستونه‌ی آیتم‌ها + دکمه‌ی ذخیره)؛ مناسب تب تنظیمات عمومی و هر صفحه‌ی مشابه، تعداد آیتم‌ها را با count می‌گیرد

import styled from "styled-components";
import { Skeleton } from "./Skeleton";

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px;
  border-radius: 5px;
  background-color: ${({ theme }) =>
    theme.colors.newColors.otherColors.inputBg};
`;

export const SettingsSkeleton = ({ count = 10 }) => (
  <>
    <Grid>
      {Array.from({ length: count }, (_, index) => (
        <Item key={index}>
          <Skeleton width="180px" height="20px" radius="4px" />
          <Skeleton width="45px" height="25px" radius="220px" />
        </Item>
      ))}
    </Grid>
    <Skeleton width="106.66px" height="50px" radius="10px" />
  </>
);
