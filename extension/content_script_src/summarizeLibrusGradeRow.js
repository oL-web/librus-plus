import translateGrade from "./translateGrade";

const summarizeLibrusGradeRow = (gradeRow) => {
    let summedGrades = 0;
    let summedScales = 0;

    if(gradeRow.children.length){
        [].slice.call(gradeRow.childNodes).forEach((span) => {
            let spanTitle;
            let translatedGrade;

            if (!span.className) {
                spanTitle = span.childNodes[2].childNodes[1].title;
                translatedGrade = translateGrade(span.childNodes[2].childNodes[1].textContent);
            }
            else {
                spanTitle = span.childNodes[1].title;
                translatedGrade = translateGrade(span.childNodes[1].textContent);
            }
    
            if (!isNaN(translatedGrade)) {
                const translatedScale = Number(
                    spanTitle.charAt(
                        spanTitle.indexOf("Waga") + 6
                    )
                );
    
                summedGrades += translatedGrade * translatedScale;
                summedScales += translatedScale;
            }
        });
    }

    return {
        summedGrades,
        summedScales
    };
};

export default summarizeLibrusGradeRow;