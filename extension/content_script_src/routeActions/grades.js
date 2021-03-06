import { el, mount } from "redom";
import { summarizeGradeRow } from "../dataExtractors";
import { calculatePossible1s } from "../calculations";
import { findGradeRows } from "../findInDOM";

export default () => {
  findGradeRows().forEach(gradeRow => {
    const { summedGrades, summedScales } = summarizeGradeRow(gradeRow);
    const possible1sScale4 = calculatePossible1s(summedGrades, summedScales, 4);
    const possible1sScale3 = calculatePossible1s(summedGrades, summedScales, 3);
    const possible1sScale2 = calculatePossible1s(summedGrades, summedScales, 2);
    const possible1sScale1 = calculatePossible1s(summedGrades, summedScales, 1);
    const summary = `Ilość jedynek wagi 4 które możesz otrzymać: ${possible1sScale4.possible1s}
      Pozostanie ci średnia: ${possible1sScale4.gpa}
      
      Ilość jedynek wagi 3 które możesz otrzymać: ${possible1sScale3.possible1s}
      Pozostanie ci średnia: ${possible1sScale3.gpa}
      
      Ilość jedynek wagi 2 które możesz otrzymać: ${possible1sScale2.possible1s}
      Pozostanie ci średnia: ${possible1sScale2.gpa}
      
      Ilość jedynek wagi 1 które możesz otrzymać: ${possible1sScale1.possible1s}
      Pozostanie ci średnia: ${possible1sScale1.gpa}`;

    const box = (
      <span onclick={() => alert(summary)}>
        <span className="grade-box librus-plus-grade-box">
          <a className="ocena librus-plus-ocena" href="#" title={summary}>
            {possible1sScale3.possible1s}
          </a>
        </span>
      </span>
    );

    mount(gradeRow, box);
  });
};

/*
alternative scrapping for future pure JS data representation

const rows = [].slice.call(document.querySelectorAll("table.decorated.stretch > tbody > tr")).filter(x => x.children.length === 10);
const subjects = {};

rows.forEach(row => {
    const { summedGrades, summedScales } = summarizeLibrusGradeRow(row.children[2]);
    const possible1sScale4 = calculatePossible1s(summedGrades, summedScales, 4);
    const possible1sScale3 = calculatePossible1s(summedGrades, summedScales, 3);
    const possible1sScale2 = calculatePossible1s(summedGrades, summedScales, 2);
    const possible1sScale1 = calculatePossible1s(summedGrades, summedScales, 1);

    const title = row.children[1].textContent;
    subjects[title] = {
        possible1sScale4,
        possible1sScale3,
        possible1sScale2,
        possible1sScale1
    };
});

console.log(subjects);
*/
