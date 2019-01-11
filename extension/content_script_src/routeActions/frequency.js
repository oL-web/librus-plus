import dayjs from "dayjs";
import { findFrequencyBoxes } from "../findInDOM";
import { translateFrequencyBox } from "../dataExtractors";
import { calculateFrequency } from "../calculations";
import applyStyles from "../applyStyles";

export default () => {
  const frequencyArr = findFrequencyBoxes().map(box => translateFrequencyBox(box));
  const timesAbsentBySubject = {};
  const currentDate = dayjs();
  const month = currentDate.month() + 1;
  const year = currentDate.year();
  let dateToCheck = dayjs()
    .set("month", 8)
    .set("day", 1);
  if (month < 9) dateToCheck = dateToCheck.set("year", year - 1);
  const schoolDaysPassed = currentDate.diff(dateToCheck, "day") - currentDate.diff(dateToCheck, "week") * 2;

  frequencyArr.forEach(obj => {
    const type = obj["Rodzaj"];
    const subject = obj["Lekcja"];

    if (type === "nieobecność" || type === "nieobecność uspr.") {
      timesAbsentBySubject[subject] = timesAbsentBySubject[subject] + 1 || 1;
    }
  });

  const inputPanel = document.createElement("tr");
  inputPanel.className = "librus-plus-input-panel";
  inputPanel.innerHTML = `
  <h2 class="librus-plus-input-panel__header">Podaj ile danych przedmiotów masz w tygodniu!</h2>
  <p class="librus-plus-input-panel__disclaimer">Dane są zapamiętane na przyszłość!</p>
  <p class="librus-plus-input-panel__disclaimer">Wyniki traktować z mocnym przymrużeniem oka, ponieważ ciężko je dokładnie obliczyć nie znając wszystkich dni wolnych itp.</p>
  `;

  const addInputHandler = (subject, timesAbsent, textEl) => e => {
    const lessonsPerWeek = e.target.value;
    const freq = calculateFrequency(schoolDaysPassed, lessonsPerWeek, timesAbsent);
    const className = "librus-plus-subject-box__frequency librus-plus-subject-box__frequency_";

    if (freq >= 85) textEl.className = className + "excellent";
    else if (freq >= 75) textEl.className = className + "good";
    else if (freq >= 65) textEl.className = className + "questionable";
    else textEl.className = className + "bad";

    textEl.textContent = `Frekwencja ${freq}%`;
    localStorage[subject + "perWeek"] = lessonsPerWeek;
  };

  for (const subject in timesAbsentBySubject) {
    const lastPerWeekValue = localStorage[subject + "perWeek"];
    const div = document.createElement("div");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const p = document.createElement("p");

    p.textContent = `↑ Uzupełnij ↑`;
    input.type = "number";
    div.className = "librus-plus-subject-box";
    input.className = "librus-plus-subject-box__input";
    p.className = "librus-plus-subject-box__frequency";
    label.textContent = subject;
    input.id = subject;
    input.value = lastPerWeekValue;
    input.addEventListener("input", addInputHandler(subject, timesAbsentBySubject[subject], p));
    if (lastPerWeekValue) input.dispatchEvent(new Event("input"));

    div.appendChild(label);
    div.appendChild(input);
    div.appendChild(p);
    inputPanel.appendChild(div);
  }

  document.querySelector(".filters.decorated.center.small > tbody").appendChild(inputPanel);

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
      margin: 0;
    }
    .librus-plus-input-panel__disclaimer{
      text-align: center;
      font-size: 12px;
    }
    .librus-plus-subject-box{
      flex-basis: 25%;
      padding: 5px;
      flex-direction: column;
      background: #404040;
      margin: 5px;
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
      text-align: center;
      text-shadow: 0 0 2px black;
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
  `);
};
