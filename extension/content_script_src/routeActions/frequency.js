import dayjs from "dayjs";
import { el, mount, setChildren } from "redom";

import { findFrequencyBoxes } from "../findInDOM";
import { translateFrequencyBox } from "../dataExtractors";
import { calculateFrequency } from "../calculations";
import applyStyles from "../applyStyles";

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
  window.dayjs = dayjs;
  if (currentMonth < 9) schoolStartDate = schoolStartDate.set("year", currentYear - 1);
  const getDaysSince = since => currentDate.diff(since, "day") - currentDate.diff(since, "week") * 2;
  const schoolDaysPassed = getDaysSince(schoolStartDate);
  const subjects = getSubjectsArr(frequencyArr);
  localStorage.secSemesterDate = localStorage.secSemesterDate || "";

  const inputPanel = el("tr.librus-plus-input-panel", [
    el("h2.librus-plus-input-panel__header", "Podaj ile danych przedmiotów masz w tygodniu!"),
    el("p.librus-plus-input-panel__disclaimer", "Dane są zapamiętane na przyszłość!"),
    el(
      "p.librus-plus-input-panel__disclaimer",
      "Wyniki traktować z mocnym przymrużeniem oka, ponieważ ciężko je dokładnie obliczyć nie znając wszystkich dni wolnych itp."
    ),
    el("div.flex-center", [
      el("p.librus-plus-input-panel__disclaimer", "Podaj datę rozpoczęcia drugiego semestru:"),
      el("input.librus-plus-input-panel__date-picker", {
        type: "date",
        value: localStorage.secSemesterDate,
        oninput: e => {
          localStorage.secSemesterDate = e.target.value;
          subjectBoxes.forEach(box => box.showFreq());
        }
      })
    ])
  ]);

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
        el("div", { className: `${getFreqClassName(freq1)} librus-plus-subject-box__frequency_old` }, `Frekwencja 1: ${freq1}%`),
        el("div", { className: getFreqClassName(freq2) }, `Frekwencja 2: ${freq2}%`)
      ]);
    } else {
      timesAbsent.firstSemester = absentLessons.length;
      const freq = calculateFrequency(schoolDaysPassed, lessonsPerWeek, timesAbsent.firstSemester);
      setChildren(textEl, [el("div", { className: getFreqClassName(freq) }, `Frekwencja 1: ${freq}%`)]);
    }
  };

  const subjectBoxes = [];
  subjects.forEach(subject => {
    const lastPerWeekValue = localStorage[subject + "perWeek"] || 0;
    const input = el("input.librus-plus-subject-box__input", {
      type: "number",
      id: subject,
      value: lastPerWeekValue
    });
    const textContainer = el("div");
    const tree = el("div.librus-plus-subject-box", [el("label", subject), input, textContainer]);
    const subjectBox = {
      subject,
      inputEl: input,
      textEl: textContainer,
      showFreq: () => showFreq(subjectBox),
      absentLessons: frequencyArr.filter(obj => obj["Lekcja"] === subject)
    };

    input.addEventListener("input", subjectBox.showFreq);
    subjectBox.showFreq();
    subjectBoxes.push(subjectBox);
    mount(inputPanel, tree);
  });

  mount(document.querySelector(".filters.decorated.center.small > tbody"), inputPanel);

  applyStyles(`
    .librus-plus-input-panel {
      text-align: center;
      padding: 10px;
      background: #151515;
      border: 10px solid gold;
      color: #e4e4e4;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      flex-wrap: wrap;
      width: 600px;
    }
    .librus-plus-input-panel__header{
      font-size: 28px;
      margin: 0 !important;
    }
    .librus-plus-input-panel__disclaimer{
      text-align: center;
      font-size: 12px;
    }
    .flex-center{
      width: 100%;
      align-items: center;
      display: flex;
      flex-direction: column;
      border-bottom: 2px solid gold;
      margin-bottom: 10px;
    }
    .librus-plus-input-panel__date-picker{
      padding: 10px;
      border: 2px solid black;
      margin-bottom: 10px;
    }
    .librus-plus-subject-box{
      margin: 5px;
      padding: 5px;
      flex-basis: calc(25% - 20px);
      flex-direction: column;
      background: #404040;
    }
    .librus-plus-subject-box__input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      border: 2px solid black;
      text-align: center;
      font-weight: bold;
      font-size: 16px;
    }
    .librus-plus-subject-box__frequency {
      text-shadow: 0 0 2px black;
      padding: 5px;
      margin:5px;
    }
    .librus-plus-subject-box__frequency_excellent {
      background: #009000;
    }
    .librus-plus-subject-box__frequency_good {
      background: #00655b;
    }
    .librus-plus-subject-box__frequency_questionable {
      background: #ad9000;
    }
    .librus-plus-subject-box__frequency_bad {
      background: #b70800;
    }
    .librus-plus-subject-box__frequency_old{
      opacity: 0.3;
    }
  `);
};
