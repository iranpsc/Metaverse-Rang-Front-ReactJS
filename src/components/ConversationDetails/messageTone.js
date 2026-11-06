export const getTone = ({ $tone, theme }) => {
  const { otherColors, shades } = theme.colors.newColors;

  return $tone === "confirmed"
    ? { background: otherColors.confirmed, text: shades[30], time: "#a0a0ab" }
    : {
        background: otherColors.bgContainer,
        text: shades.title,
        time: shades.title,
      };
};
