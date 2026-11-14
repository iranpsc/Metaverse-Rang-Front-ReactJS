// اسکلت لودینگ لیست پیشنهادها؛ مناسب نمایش چند کارت اسکلت (دریافتی/ارسالی) در حالت بارگذاری
import SuggestionSkeleton from "./SuggestionSkeleton";

const SuggestionsSkeleton = ({ variant, count = 3 }) =>
  Array.from({ length: count }).map((_, index) => (
    <SuggestionSkeleton key={index} variant={variant} />
  ));

export default SuggestionsSkeleton;