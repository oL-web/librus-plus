import translateGrade from "./translateGrade";

export const summarizeGradeRow = gradeRow => {
  let summedGrades = 0;
  let summedScales = 0;

  if (gradeRow.children.length) {
    Array.from(gradeRow.childNodes).forEach(span => {
      let spanTitle;
      let translatedGrade;

      if (!span.className) {
        spanTitle = span.childNodes[2].childNodes[1].title;
        translatedGrade = translateGrade(span.childNodes[2].childNodes[1].textContent);
      } else {
        spanTitle = span.childNodes[1].title;
        translatedGrade = translateGrade(span.childNodes[1].textContent);
      }

      if (!isNaN(translatedGrade)) {
        const translatedScale = Number(spanTitle.charAt(spanTitle.indexOf("Waga") + 6));

        summedGrades += translatedGrade * translatedScale;
        summedScales += translatedScale;
      }
    });
  }

  return { summedGrades, summedScales };
};

const titleRegex = new RegExp("<br>|<br/>|</b>", "i");

export const translateFrequencyBox = frequencyBox => {
  const obj = {};

  frequencyBox.title.split(titleRegex).forEach(titleLine => {
    if (!titleLine) return;
    const splitLine = titleLine.split(":");
    Object.defineProperty(obj, splitLine[0].trim(), { value: splitLine[1].trim() });
  });

  return obj;
};
