import "./styles.css";
import gradesRouteAction from "./routeActions/grades";
import frequencyRouteAction from "./routeActions/frequency";

switch (location.pathname) {
  case "/przegladaj_nb/uczen": {
    frequencyRouteAction();
    break;
  }
  case "/przegladaj_oceny/uczen": {
    gradesRouteAction();
    break;
  }
}
