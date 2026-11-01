import SkeletonGrid from "../Common/SkeletonGrid";
const SKELETON_COUNTS = [1, 2, 2, 2, 2, 2];

export const SecuritySkeleton = () => (
  <>
    {SKELETON_COUNTS.map((count, index) => (
      <SkeletonGrid key={index} count={count} />
    ))}
  </>
);