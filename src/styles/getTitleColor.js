// انتخاب رنگ متن تایتل‌ها بر اساس پراپ‌های color، primary، gray و gray2؛ مناسب TitleBody و TitleHeader
<<<<<<< HEAD
export const getTitleColor = ({ theme, $color, $gray, $mutedText, $primary }) => {
=======
export const getTitleColor = ({ theme, $color, $gray, $gray2, $primary }) => {
>>>>>>> e1d8d9c4424483b861365e40d645cd213ed9263e
  if ($color) return $color;
  if ($primary) return theme.colors.primary;

  const { otherColors, shades } = theme.colors.newColors;
<<<<<<< HEAD
  if ($mutedText) return otherColors.mutedText;
=======
  if ($gray2) return shades.matn2;
>>>>>>> e1d8d9c4424483b861365e40d645cd213ed9263e
  if ($gray) return otherColors.gray;
  return shades.title;
};