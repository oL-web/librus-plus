const agent = superagent.agent();
const loginDetails = document.querySelector(".login-details");
const loginInput = document.querySelector(".login-form__login");
const passInput = document.querySelector(".login-form__pass");
const rememberCheckbox = document.querySelector(".login-form__remember");

document.querySelector(".login-form").onsubmit = e => e.preventDefault();

chrome.storage.local.get(["librusPlusPass", "librusPlusLogin", "librusPlusRemember"], acc => {
  const { librusPlusLogin, librusPlusPass, librusPlusRemember } = acc;
  if (!librusPlusLogin && !librusPlusPass) return;

  loginInput.value = librusPlusLogin;
  passInput.value = librusPlusPass;
  rememberCheckbox.checked = librusPlusRemember;
});

document.querySelector(".login-form__submit").onclick = async () => {
  if (!loginInput.value && !passInput.value) {
    loginDetails.textContent = "Wypełnij oba pola!";
    loginDetails.classList.add("login-details_failed");
    return;
  }

  try {
    loginDetails.textContent = "Trwa logowanie...";
    loginDetails.className = "";

    await agent.get("https://synergia.librus.pl/loguj/portalRodzina");
    await agent
      .post("https://api.librus.pl/OAuth/Authorization?client_id=46")
      .type("form")
      .send({
        action: "login",
        login: loginInput.value,
        pass: passInput.value
      });

    await agent.get("https://api.librus.pl/OAuth/Authorization/Grant?client_id=46");
    await agent.get("https://synergia.librus.pl/przegladaj_oceny/uczen");
    if (rememberCheckbox.checked) {
      chrome.storage.local.set({
        librusPlusPass: passInput.value,
        librusPlusLogin: loginInput.value,
        librusPlusRemember: true
      });
    } else {
      chrome.storage.local.remove(["librusPlusPass", "librusPlusLogin", "librusPlusRemember"]);
    }

    window.open("https://synergia.librus.pl/przegladaj_oceny/uczen");

    loginDetails.textContent = "Pomyślnie zalogowano!";
    loginDetails.classList.add("login-details_successful");
  } catch (e) {
    loginDetails.textContent = "Wystąpił błąd podczas logowania!";
    loginDetails.classList.add("login-details_failed");
  }
};
