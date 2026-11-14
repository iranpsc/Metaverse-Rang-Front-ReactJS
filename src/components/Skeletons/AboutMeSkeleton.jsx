import { Skeleton } from "./Skeleton";
import styled from "styled-components";
import Container from "../Common/Container";

const TOOLBAR_BUTTON_COUNT = 5;

// عرض برچسب هر فیلد در اسکلتون شغل و تحصیلات (هر ردیف دو فیلد دارد)
const JOB_FIELD_ROWS = [
  ["80px", "80px"],
  ["100px", "80px"],
];

const SkeletonContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  border-bottom: 1px solid #454545;
`;

const SkeletonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonRow = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 8px;
`;

const SkeletonField = styled(Stack)`
  flex: 1;
`;

const SkeletonEditor = styled.div`
  margin-top: 8px;
  padding: 12px;
  border: 1px solid #454545;
  border-radius: 8px;
`;

const SkeletonToolbar = styled(SkeletonRow)`
  justify-content: flex-end;
  margin-top: 12px;
`;

// اسکلتون بخش SaveInfo (عنوان و دکمه)
const SaveInfoSkeleton = () => (
  <SkeletonHeader>
    <Stack>
      <Skeleton width="120px" height="24px" radius="4px" />
      <Skeleton width="250px" height="14px" radius="4px" />
    </Stack>
    <Skeleton width="124px" height="50px" radius="8px" />
  </SkeletonHeader>
);

// اسکلتون بخش About (درباره من)
const AboutSkeleton = () => (
  <SkeletonSection>
    <Skeleton width="100px" height="20px" radius="4px" />
    <Skeleton width="300px" height="14px" radius="4px" />

    <SkeletonEditor>
      <Skeleton width="100%" height="100px" radius="4px" />
      <SkeletonToolbar>
        {Array.from({ length: TOOLBAR_BUTTON_COUNT }, (_, index) => (
          <Skeleton key={index} width="60px" height="30px" radius="4px" />
        ))}
      </SkeletonToolbar>
    </SkeletonEditor>
  </SkeletonSection>
);

// اسکلتون بخش EducationsAndJob (شغل و تحصیلات)
const EducationsAndJobSkeleton = () => (
  <SkeletonSection>
    {JOB_FIELD_ROWS.map((labels, rowIndex) => (
      <SkeletonRow key={rowIndex}>
        {labels.map((labelWidth, fieldIndex) => (
          <SkeletonField key={fieldIndex}>
            <Skeleton width={labelWidth} height="16px" radius="4px" />
            <Skeleton width="100%" height="40px" radius="8px" />
          </SkeletonField>
        ))}
      </SkeletonRow>
    ))}
  </SkeletonSection>
);

export const AboutMeSkeleton = () => (
  <SkeletonContainer>
    <SaveInfoSkeleton />
    <AboutSkeleton />
    <EducationsAndJobSkeleton />
  </SkeletonContainer>
);
