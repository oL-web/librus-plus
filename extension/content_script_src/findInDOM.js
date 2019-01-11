export const findGradeRows = () => {
  const result = Array.from(document.querySelectorAll("[class*=line] > td:not(:empty):not([class])"));

  return result.filter(item => item.childNodes[0].nodeName === "SPAN");
};

export const findFrequencyBoxes = () => Array.from(document.querySelectorAll(".center.big.decorated td p>a"));
