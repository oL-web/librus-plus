import summarizeLibrusGradeRow from "./summarizeLibrusGradeRow";
import calculatePossible1s from "./calculatePossible1s";
import findLibrusGradeRows from "./findLibrusGradeRows";

findLibrusGradeRows().forEach((gradeRow) => {
    const { summedGrades, summedScales } = summarizeLibrusGradeRow(gradeRow);

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

    const titleContent = `
<span class="grade-box librus-plus__grade-box">
    <a class="ocena librus-plus__ocena" href="#" title="${summary}">
    ${possible1sScale3.possible1s}
    </a>
</span>
`;

    const gradeSpan = document.createElement("span");
    gradeSpan.innerHTML = titleContent;
    gradeSpan.onclick = () => alert(summary);
    gradeRow.appendChild(gradeSpan);
});

const styles = `
.librus-plus__grade-box{
    background-color:black;
    color:white;
    border: 8px solid gold;
}
.librus-plus__ocena{
    color: white !important;
    font-weight: bold;
}
`;

const styleNode = document.createElement("style");
styleNode.innerHTML = styles;
document.head.appendChild(styleNode);

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