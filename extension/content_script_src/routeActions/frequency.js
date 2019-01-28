import dayjs from "dayjs";
import { el, mount, setChildren } from "redom";
import { findFrequencyBoxes } from "../findInDOM";
import { translateFrequencyBox } from "../dataExtractors";
import { calculateFrequency } from "../calculations";

const getSubjectsArr = frequencyArr => {
  let obj = {};
  frequencyArr.forEach(freq => {
    obj[freq["Lekcja"]] = true;
  });
  return Object.keys(obj);
};

const getFreqClassName = freq => {
  let className = "librus-plus-subject-box__frequency librus-plus-subject-box__frequency_";

  if (freq >= 85) className += "excellent";
  else if (freq >= 75) className += "good";
  else if (freq >= 65) className += "questionable";
  else className += "bad";

  return className;
};

export default () => {
  const frequencyArr = findFrequencyBoxes()
    .map(translateFrequencyBox)
    .filter(obj => {
      const type = obj["Rodzaj"];
      return type === "nieobecność" || type === "nieobecność uspr.";
    });
  const currentDate = dayjs();
  const currentMonth = currentDate.month() + 1;
  const currentYear = currentDate.year();
  let schoolStartDate = dayjs()
    .set("month", 8)
    .set("date", 1);
  if (currentMonth < 9) schoolStartDate = schoolStartDate.set("year", currentYear - 1);
  const getDaysSince = since => currentDate.diff(since, "day") - currentDate.diff(since, "week") * 2;
  const schoolDaysPassed = getDaysSince(schoolStartDate);
  const subjects = getSubjectsArr(frequencyArr);
  localStorage.secSemesterDate = localStorage.secSemesterDate || "";

  const inputPanel = (
    <tr className="librus-plus-input-panel">
      <h2 className="librus-plus-input-panel__header">Podaj ile danych przedmiotów masz w tygodniu!</h2>
      <p className="librus-plus-input-panel__disclaimer">Dane są zapamiętane na przyszłość!</p>
      <p className="librus-plus-input-panel__disclaimer">
        Wyniki traktować z mocnym przymrużeniem oka, ponieważ ciężko je dokładnie obliczyć nie znając wszystkich dni wolnych itp.
      </p>
      <div className="flex-center">
        <p className="librus-plus-input-panel__disclaimer">Podaj datę rozpoczęcia drugiego semestru:</p>
        <input
          className="librus-plus-input-panel__date-picker"
          type="date"
          value={localStorage.secSemesterDate}
          oninput={e => {
            localStorage.secSemesterDate = e.target.value;
            subjectBoxes.forEach(box => box.showFreq());
          }}
        />
      </div>
    </tr>
  );

  const showFreq = obj => {
    const { subject, textEl, inputEl, absentLessons } = obj;
    const lessonsPerWeek = Number(inputEl.value);
    const timesAbsent = { firstSemester: 0, secondSemester: 0 };
    const sec = dayjs(localStorage.secSemesterDate);
    localStorage[subject + "perWeek"] = lessonsPerWeek;

    if (sec.isValid() && sec.isBefore(currentDate)) {
      const daysPassedSinceSec = getDaysSince(sec);

      absentLessons.forEach(lesson => {
        if (dayjs(lesson["Data"]).isBefore(sec)) timesAbsent.firstSemester += 1;
        else timesAbsent.secondSemester += 1;
      });

      const freq1 = calculateFrequency(schoolDaysPassed - daysPassedSinceSec, lessonsPerWeek, timesAbsent.firstSemester);
      const freq2 = calculateFrequency(daysPassedSinceSec, lessonsPerWeek, timesAbsent.secondSemester);

      setChildren(textEl, [
        <div className={getFreqClassName(freq1) + " librus-plus-subject-box__frequency_old"}>Frekwencja 1: {freq1}%</div>,
        <div className={getFreqClassName(freq2)}>Frekwencja 2: {freq2}%</div>
      ]);
    } else {
      timesAbsent.firstSemester = absentLessons.length;
      const freq = calculateFrequency(schoolDaysPassed, lessonsPerWeek, timesAbsent.firstSemester);
      setChildren(textEl, [<div className={getFreqClassName(freq)}>Frekwencja: {freq}%</div>]);
    }
  };

  const subjectBoxes = subjects.map(subject => {
    const lastPerWeekValue = localStorage[subject + "perWeek"] || 0;
    const textContainer = <div />;
    const input = <input type="number" value={lastPerWeekValue} className="librus-plus-subject-box__input" />;
    const tree = (
      <div className="librus-plus-subject-box">
        <label>{subject}</label>
        {input}
        {textContainer}
      </div>
    );
    const subjectBox = {
      subject,
      inputEl: input,
      textEl: textContainer,
      showFreq: () => showFreq(subjectBox),
      absentLessons: frequencyArr.filter(obj => obj["Lekcja"] === subject)
    };

    input.addEventListener("input", subjectBox.showFreq);
    subjectBox.showFreq();
    mount(inputPanel, tree);
    return subjectBox;
  });

  mount(document.querySelector(".filters.decorated.center.small > tbody"), inputPanel);
};
