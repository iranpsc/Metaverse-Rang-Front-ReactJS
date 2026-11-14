// انتخاب رنگ متن تایتل‌ها بر اساس پراپ‌های color، primary، gray و gray2؛ مناسب TitleBody و TitleHeader
export const getTitleColor = ({ theme, $color, $gray, $mutedText, $primary }) => {
  if ($color) return $color;
  if ($primary) return theme.colors.primary;

  const { otherColors, shades } = theme.colors.newColors;
  if ($mutedText) return otherColors.mutedText;
  if ($gray) return otherColors.gray;
  return shades.title;
};