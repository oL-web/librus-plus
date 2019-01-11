export default styles => {
  const styleNode = document.createElement("style");
  styleNode.innerHTML = styles;
  document.head.appendChild(styleNode);
};
