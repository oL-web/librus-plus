const MIN_GPA = 1.65;

export const calculatePossible1s = (summedGrades, summedScales, scale) => {
  let possible1s = 0;
  let gpa = summedGrades / summedScales;
  let gpaSafe = summedGrades / summedScales;

  while (gpa > MIN_GPA && (summedGrades + scale) / (summedScales + scale) > MIN_GPA) {
    summedGrades += scale;
    summedScales += scale;
    gpa = summedGrades / summedScales;

    if (summedGrades / summedScales > MIN_GPA) {
      possible1s++;
      gpaSafe = summedGrades / summedScales;
    }
  }

  return { possible1s, gpa: gpaSafe.toFixed(3) };
};

export const calculateFrequency = (schoolDaysPassed, lessonsPerWeek, timesAbsent) => {
  const lessonsPassed = (schoolDaysPassed / 5) * lessonsPerWeek;
  const frequency = ((lessonsPassed - timesAbsent) / lessonsPassed) * 100;
  const roundedFrequency = Math.round(Math.max(Math.min(frequency, 100), 0));

  return roundedFrequency;
};
