const findLibrusGradeRows = () => (
    [].slice.call(document.querySelectorAll("[class*=line] > td:not(:empty):not([class])")).filter(item => item.childNodes[0].nodeName === "SPAN")
);

export default findLibrusGradeRows;