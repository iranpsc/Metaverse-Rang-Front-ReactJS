// انتخاب رنگ متن تایتل‌ها بر اساس پراپ‌های color، primary، gray و gray2؛ مناسب TitleBody و TitleHeader
export const getTitleColor = ({ theme, $color, $gray, $gray2, $primary }) => {
  if ($color) return $color;
  if ($primary) return theme.colors.primary;

  const { otherColors, shades } = theme.colors.newColors;
  if ($gray2) return shades.matn2;
  if ($gray) return otherColors.gray;
  return shades.title;
};