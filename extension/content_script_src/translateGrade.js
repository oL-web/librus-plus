const translateGrade = grade => {
  if (grade.length === 2) {
    const firstChar = grade.charAt(0);
    const secondChar = grade.charAt(1);

    if (grade === "nb") grade = 0;
    else if (secondChar === "+") grade = firstChar + ".5";
    else if (secondChar === "-") grade = Number(firstChar) - 0.25;
  }

  return Number(grade);
};

export default translateGrade;
