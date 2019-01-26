import { el, mount } from "redom";

export default styles => mount(document.head, el("style", styles));
