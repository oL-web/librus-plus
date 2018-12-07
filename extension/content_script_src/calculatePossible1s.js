const MIN_GPA = 1.65;

const calculatePossible1s = (summedGrades, summedScales, scale) => {
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
    
    return {
        possible1s,
        gpa: gpaSafe.toFixed(3)
    };
};

export default calculatePossible1s;